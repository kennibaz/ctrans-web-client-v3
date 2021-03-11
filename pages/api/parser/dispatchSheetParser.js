
import { makes } from "../../../src/makes";
import {
  PaymentStartUpon,
  PaymentMethods,
  CarTypes,
  PaymentTerms,
} from "../../../utils/constants";
const axios = require("axios");

const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

/*TODO

check scenarios
1. If not a Central dispatch sheet > check if CD Reference present

2. Check if no Address For Pickup and Delivery present > check for "CONTACT DISPATCHER" in address field

3. Check if no phone for Pickup and Delivery present > check for "CONTACT DISPATCHER" in phone field



=======================================

Add contract terms
add Lot number
add buyer number

*/

export default async (req, res) => {
  if (req.method === "POST") {
    return new Promise(async (resolve) => {
      const { document } = req.body;

      // let newPath = path.join(__dirname, "..", "DispatchSheet.pdf");

      // let dataBuffer = fs.readFileSync(newPath);

      let dataBuffer = document;

      const data = await pdf(dataBuffer);

      let resultData = data.text;
      // console.log(resultData)
      var zipNumberPatternInAddress = / \d+/g;

      //Intial Split by blocks

      try {
        var pickupInformation = resultData.substring(
          resultData.lastIndexOf("Pickup Information"),
          resultData.lastIndexOf("Delivery Information")
        );
        var deliveryInformation = resultData.substring(
          resultData.lastIndexOf("Delivery Information"),
          resultData.indexOf("DISPATCH INSTRUCTIONS")
        );
        var pickupDate = resultData.substring(
          resultData.lastIndexOf("Pickup Estimated:"),
          resultData.lastIndexOf("Delivery Estimated:")
        );
        var deliveryDate = resultData.substring(
          resultData.lastIndexOf("Delivery Estimated:"),
          resultData.lastIndexOf("Ship Via:")
        );
        var orderId = resultData.substring(
          resultData.lastIndexOf("Order ID:"),
          resultData.lastIndexOf("Total Vehicles:")
        );
        var paymentInformation = resultData.substring(
          resultData.lastIndexOf("Price Listed:"),
          resultData.lastIndexOf(
            "*The company (broker, dealer, auction, rental company, etc.)"
          )
        );
        var paymentInformationTerms = paymentInformation.substring(
          paymentInformation.lastIndexOf("agrees to pay")
        );

        var shipperInformation = resultData.substring(
          resultData.lastIndexOf("Dispatch Sheet"),
          resultData.lastIndexOf("Vehicle Information")
        );
        var vehicleInformation = resultData.substring(
          resultData.lastIndexOf("Vehicle Information"),
          resultData.lastIndexOf("Pickup Information")
        );

        var instructionInformation = resultData.substring(
          resultData.lastIndexOf("DISPATCH INSTRUCTIONS"),
          resultData.lastIndexOf("CD reference")
        );

        var datesInformation = resultData.substring(
          resultData.lastIndexOf("Dispatch Date:"),
          resultData.lastIndexOf("Ship Via:")
        );

        var resultDataSplitByLines = resultData.split("\n");
      } catch (error) {
        console.log(error, "error in initial split");
      }

      //////Second split blocks by lines

      try {
        var pickupInformationSplitByLines = pickupInformation.split("\n");
        var deliveryInformationSplitByLines = deliveryInformation.split("\n");
        var paymentInformationSplitByLines = paymentInformation.split("\n");

        var datesInformationSplitByLines = datesInformation.split("\n");
        var vehicleInformationSplitByLines = vehicleInformation.split("\n");
        //remove last and first elements from vehicles array
        vehicleInformationSplitByLines.shift();
        vehicleInformationSplitByLines.pop();

        vehicleInformationSplitByLines = vehicleInformationSplitByLines.map(
          (element) => element.slice(3)
        );
      } catch (error) {
        console.log(error, "error in secon split");
      }

      //SHIPPER============================================================
      try {
        //make substrings with name and contact info
        var shipperNamePartsplitByLines = shipperInformation
          .substring(0, shipperInformation.lastIndexOf("Co. Phone")).trim()
          .split("\n");
        var shipperContactPart = shipperInformation
          .substring(shipperInformation.lastIndexOf("Contact:"))
        var shipperPhonePart = shipperInformation
        .substring(shipperInformation.lastIndexOf("Co. Phone"), shipperInformation.lastIndexOf("Dispatch Info") ).trim();



        //get zip part

        var shipperZipInitial = shipperNamePartsplitByLines[shipperNamePartsplitByLines.length - 1].split(" ")
        var shipperZip = shipperZipInitial[shipperZipInitial.length - 1];

        //get city and state based on zip part
        var shipperAddress2 = await getGoogleCoordinates(shipperZip);
        var shipperAddress2Split = shipperAddress2.split(",");
        var shipperCity = shipperAddress2Split[0];
        var shipperState = shipperAddress2Split[1].trim().slice(0, 2);

        //remove city, state and zip from array. Remove Dispatch sheet string from array
        shipperNamePartsplitByLines.shift()
        shipperNamePartsplitByLines.pop()


        //find index of element where first are numbers

        var indexOfAddressElementInShipperAddress = ""

        shipperNamePartsplitByLines.filter((word, index)=> {
          if (word.match(/^\d+/)) {
            indexOfAddressElementInShipperAddress = index
            return true
          } else {
            return false
          }
        })

        //make array of names
        var shipperName = shipperNamePartsplitByLines.splice(0, indexOfAddressElementInShipperAddress).join(" ")

        var shipperAddress = shipperNamePartsplitByLines.join(" ");
        
     
        var shipperContactNameSubString = shipperContactPart.substring(
          shipperContactPart.lastIndexOf("Contact:"),
          shipperContactPart.lastIndexOf("Phone:")
        );
        var shipperContactName = shipperContactNameSubString
          .replace("Contact:", "")
          .trim();

        var shipperPhone = shipperPhonePart.replace("Co. Phone:", "").trim();
       
        var shipperOrderId = resultDataSplitByLines[2]
          .substring(resultDataSplitByLines[2].indexOf(":") + 1)
          .trim();

        
      } catch (error) {
        console.log(error, "Error in shipper");
      }

      //PICKUP===================================================================================

      try {

        //Make initial Substrings with Address and Phones
        
        //substring with pickup contact name and business name information
        var pickupNameSubstringInitial = pickupInformation.substring(pickupInformation.lastIndexOf("Name:"), pickupInformation.lastIndexOf("Phone:") )
        // subsring with Pickup phone numbers
        var pickupPhoneSubstringInitial = pickupInformation.substring(pickupInformation.lastIndexOf("Phone:")).trim()


        //check if buyer number is presented

        var isBuyerNumberPresentedInPickupCheck1 = pickupNameSubstringInitial.search(
          "Buyer"
        );
        var isBuyerNumberPresentedInPickupCheck2 = pickupNameSubstringInitial.search(
          "Num:"
        );
        //check if buyer number is available then substring again
        if (
          isBuyerNumberPresentedInPickupCheck1 > 0 &&
          isBuyerNumberPresentedInPickupCheck2 > 0
        ) {
          var pickupNameSubStringSecondary = pickupNameSubstringInitial.substring(
            pickupNameSubstringInitial.lastIndexOf("Name:"),
            pickupNameSubstringInitial.lastIndexOf("Buyer")
          );
        } else {
          var pickupNameSubStringSecondary = pickupNameSubstringInitial.substring(
            pickupNameSubstringInitial.lastIndexOf("Name:")
          );
        }

        //check if business name is presented (double check)
        var isBusinessNameOnPickupAvailableCheck1 = pickupNameSubStringSecondary.includes(
          "("
        );
        var isBusinessNameOnPickupAvailableCheck2 = pickupNameSubStringSecondary.includes(
          ")"
        );

        if (
          isBusinessNameOnPickupAvailableCheck1 &&
          isBusinessNameOnPickupAvailableCheck2
        ) {
          var pickupBusinessName = pickupNameSubStringSecondary
            .substring(
              pickupNameSubStringSecondary.indexOf("(") + 1,
              pickupNameSubStringSecondary.indexOf(")")
            )
            .trim();
        } else pickupBusinessName = "Not Available";

        //check if Contact name is available
        var isContactNameOnPickupAvailable = pickupInformationSplitByLines[1].search(
          "DISPATCHER"
        );
        if (isContactNameOnPickupAvailable > 0) {
          pickupContactName = "CONTACT DISPATCHER";
        } else {
          if (pickupBusinessName === "Not Available") {
            var pickupContactName = pickupInformationSplitByLines[1]
              .substring(pickupInformationSplitByLines[1].indexOf(":") + 1)
              .trim();
          } else {
            var pickupContactName = pickupInformationSplitByLines[1]
              .substring(
                pickupInformationSplitByLines[1].indexOf(":") + 1,
                pickupInformationSplitByLines[1].indexOf("(")
              )
              .trim();
          }
        }

        //detect substring in pickup address

        //case if buyer number is not presented. 
        //Remove from substrinng COntact and Business names and other text. left only address
        if (
          isBuyerNumberPresentedInPickupCheck1 < 0 &&
          isBuyerNumberPresentedInPickupCheck2 < 0
        ) {
          var pickupAddressSubStringInitial = pickupNameSubStringSecondary
            .replace(pickupBusinessName, "")
            .replace(pickupContactName, "")
            .replace("**", "")
            .replace("(", "")
            .replace(")", "")
            .replace("Name:", "")
            .trim();

            //Then split string into array
          var pickupAddressSubStringInitialSplit = pickupAddressSubStringInitial.split(
            " "
          );

          //get zip from split array
          var pickupAddressZipMatch =
            pickupAddressSubStringInitialSplit[
              pickupAddressSubStringInitialSplit.length - 1
            ];

            //check if ZIP is correct
            //check if length is 5 and all are numbers
            var isZipCorrect = zipCheck(pickupAddressZipMatch)

            //get City, State by ZIP
          if (isZipCorrect) {
            var pickupAddressGoogleRequest = await getGoogleCoordinates(
              pickupAddressZipMatch
            );
            var pickupAddressGoogleRequestSplit = pickupAddressGoogleRequest.split(
              ","
            );
            var pickupCity = pickupAddressGoogleRequestSplit[0];
            var pickupState = pickupAddressGoogleRequestSplit[1]
              .trim()
              .slice(0, 2);
            var pickupZip = pickupAddressZipMatch;
          } else {
            var pickupCity = ""
            var pickupState = ""
            var pickupZip = ""
            var isPickupZipError = true;
          }

          var pickupCityAllLower = pickupCity.toLowerCase(); //Remove city duplicate in lower case from DS

          //remove city state zip from address line. Keep only street 
          var pickupAddressSubStringThird = pickupAddressSubStringInitial
            .replace(pickupCity, "")
            .replace(pickupState, "")
            .replace(pickupAddressZipMatch, "")
            .replace(pickupCityAllLower, "")
            .replace(",", "")
            .trim();

          //check if address is available
          var isAddressOnPickupAvailable = pickupAddressSubStringThird.search(
            "DISPATCHER"
          );

          if (isAddressOnPickupAvailable > 0) {
            pickupAddress = "CONTACT DISPATCHER";
          } else {
            var pickupAddress = pickupAddressSubStringThird.trim();
          }
        }

        //Case when buyer number is presented
        if (
          isBuyerNumberPresentedInPickupCheck1 > 0 &&
          isBuyerNumberPresentedInPickupCheck2 > 0
        ) {


          //get substring with address
          var pickupAddressSubStringWithBuyerNumber = pickupNameSubstringInitial
            .substring(pickupNameSubstringInitial.lastIndexOf("Buyer Num:"))
            .trim();
          //then split into array
          var pickupAddressSubStringWithBuyerNumberSplit = pickupAddressSubStringWithBuyerNumber.split(
            "\n"
          );

          //find element of array with Buyer Number 

          var buyerIndexInArray = pickupAddressSubStringWithBuyerNumberSplit.findIndex(
            (element) => element.includes("Buyer")
          );
          var buyerNumber = pickupAddressSubStringWithBuyerNumberSplit[
            buyerIndexInArray
          ]
            .replace("Buyer Num:", "")
            .trim();

          

          //get last element with state, zip ,city and split

          var pickupAdressCityStateZipSplit = pickupAddressSubStringWithBuyerNumberSplit[
            pickupAddressSubStringWithBuyerNumberSplit.length - 1
          ].split(" ");

          // get zip frpm array

          var pickupAddressZipMatch =
            pickupAdressCityStateZipSplit[
              pickupAdressCityStateZipSplit.length - 1
            ];
          //check if ZIP is correct
          //check if length is 5 and all are numbers
          var isZipCorrect = zipCheck(pickupAddressZipMatch);

          //get City, State by ZIP
          if (isZipCorrect) {
            var pickupAddressGoogleRequest = await getGoogleCoordinates(
              pickupAddressZipMatch
            );
            var pickupAddressGoogleRequestSplit = pickupAddressGoogleRequest.split(
              ","
            );
            var pickupCity = pickupAddressGoogleRequestSplit[0];
            var pickupState = pickupAddressGoogleRequestSplit[1]
              .trim()
              .slice(0, 2);
            var pickupZip = pickupAddressZipMatch;
          } else {
            var pickupCity = "";
            var pickupState = "";
            var pickupZip = "";
            var isPickupZipError = true;
          }

          //remove element with buyer number from array

          pickupAddressSubStringWithBuyerNumberSplit.splice(buyerIndexInArray,1)
          //gete street Address
          var pickupAddressStreet = pickupAddressSubStringWithBuyerNumberSplit[0]

          //check if address is exists

           //check if address is available
           var isAddressOnPickupAvailable = pickupAddressStreet.search(
            "DISPATCHER"
          );

          if (isAddressOnPickupAvailable > 0) {
            pickupAddress = "CONTACT DISPATCHER";
          } else {
            var pickupAddress = pickupAddressStreet.trim();
          }
        }

        //check how many phones in order

        

        var phonesOnPickupCount = (
          pickupPhoneSubstringInitial.match(/Phone/g) || []
        ).length;


        // var phonesOnPickupCount = (
        //   pickupInformationSplitByLines[4].match(/Phone/g) || []
        // ).length;

        //if more than 1 phone in order:
        if (phonesOnPickupCount > 1) {
          var pickupPhonesSplit = pickupPhoneSubstringInitial.split(
            "Phone"
          );
          pickupPhonesSplit.shift();
          var formattedPhonesOnPickup = [];
          pickupPhonesSplit.forEach((element) => {
            var formattedPhone = element.split(":").pop();
            formattedPhonesOnPickup.push(formattedPhone);
          });
          pickupPhone = formattedPhonesOnPickup.pop();
        } else {
          // check if phone is available
          var isPhoneOnPickupAvailable = pickupPhoneSubstringInitial.search(
            "DISPATCHER"
          );

          if (isPhoneOnPickupAvailable > 0) {
            pickupPhone = "CONTACT DISPATCHER";
          } else {
            var pickupPhone = pickupPhoneSubstringInitial
              .substring(pickupPhoneSubstringInitial.indexOf(":") + 1)
              .trim();
          }
        }
      } catch (error) {
        console.log(error, "error insude Pickup");
      }

      //DELIVERY============================

      try {


        //Make initial Substrings with Address and Phones
        
        //substring with delivery contact name and business name information
        var deliveryNameSubstringInitial = deliveryInformation.substring(deliveryInformation.lastIndexOf("Name:"), deliveryInformation.lastIndexOf("Phone:") )
        // subsring with delivery phone numbers
        var deliveryPhoneSubstringInitial = deliveryInformation.substring(deliveryInformation.lastIndexOf("Phone:")).trim()


        //check if buyer number is presented

        var isBuyerNumberPresentedInDeliveryCheck1 = deliveryNameSubstringInitial.search(
          "Buyer"
        );
        var isBuyerNumberPresentedInDeliveryCheck2 = deliveryNameSubstringInitial.search(
          "Num:"
        );
        //check if buyer number is available then substring again
        if (
          isBuyerNumberPresentedInDeliveryCheck1 > 0 &&
          isBuyerNumberPresentedInDeliveryCheck2 > 0
        ) {
          var deliveryNameSubStringSecondary = deliveryNameSubstringInitial.substring(
            deliveryNameSubstringInitial.lastIndexOf("Name:"),
            deliveryNameSubstringInitial.lastIndexOf("Buyer")
          );
        } else {
          var deliveryNameSubStringSecondary = deliveryNameSubstringInitial.substring(
            deliveryNameSubstringInitial.lastIndexOf("Name:")
          );
        }

        //check if business name is presented (double check)
        var isBusinessNameOnDeliveryAvailableCheck1 = deliveryNameSubStringSecondary.includes(
          "("
        );
        var isBusinessNameOnDeliveryAvailableCheck2 = deliveryNameSubStringSecondary.includes(
          ")"
        );

        if (
          isBusinessNameOnDeliveryAvailableCheck1 &&
          isBusinessNameOnDeliveryAvailableCheck2
        ) {
          var deliveryBusinessName = deliveryNameSubStringSecondary
            .substring(
              deliveryNameSubStringSecondary.indexOf("(") + 1,
              deliveryNameSubStringSecondary.indexOf(")")
            )
            .trim();
        } else deliveryBusinessName = "Not Available";

        //check if Contact name is available
        var isContactNameOnDeliveryAvailable = deliveryInformationSplitByLines[1].search(
          "DISPATCHER"
        );
        if (isContactNameOnDeliveryAvailable > 0) {
          deliveryContactName = "CONTACT DISPATCHER";
        } else {
          if (deliveryBusinessName === "Not Available") {
            var deliveryContactName = deliveryInformationSplitByLines[1]
              .substring(deliveryInformationSplitByLines[1].indexOf(":") + 1)
              .trim();
          } else {
            var deliveryContactName = deliveryInformationSplitByLines[1]
              .substring(
                deliveryInformationSplitByLines[1].indexOf(":") + 1,
                deliveryInformationSplitByLines[1].indexOf("(")
              )
              .trim();
          }
        }

        //detect substring in delivery address

        //case if buyer number is not presented. 
        //Remove from substrinng COntact and Business names and other text. left only address
        if (
          isBuyerNumberPresentedInDeliveryCheck1 < 0 &&
          isBuyerNumberPresentedInDeliveryCheck2 < 0
        ) {
          var deliveryAddressSubStringInitial = deliveryNameSubStringSecondary
            .replace(deliveryBusinessName, "")
            .replace(deliveryContactName, "")
            .replace("**", "")
            .replace("(", "")
            .replace(")", "")
            .replace("Name:", "")
            .trim();

            //Then split string into array
          var deliveryAddressSubStringInitialSplit = deliveryAddressSubStringInitial.split(
            " "
          );

          //get zip from split array
          var deliveryAddressZipMatch =
            deliveryAddressSubStringInitialSplit[
              deliveryAddressSubStringInitialSplit.length - 1
            ];

            //check if ZIP is correct
            //check if length is 5 and all are numbers
            var isZipCorrect = zipCheck(deliveryAddressZipMatch)
  

            //get City, State by ZIP
          if (isZipCorrect) {
            var deliveryAddressGoogleRequest = await getGoogleCoordinates(
              deliveryAddressZipMatch
            );
            var deliveryAddressGoogleRequestSplit = deliveryAddressGoogleRequest.split(
              ","
            );
            var deliveryCity = deliveryAddressGoogleRequestSplit[0];
            var deliveryState = deliveryAddressGoogleRequestSplit[1]
              .trim()
              .slice(0, 2);
            var deliveryZip = deliveryAddressZipMatch;
          } else {
            var deliveryCity = ""
            var deliveryState = ""
            var deliveryZip = ""
            var isDeliveryZipError = true;
          }

          var deliveryCityAllLower = deliveryCity.toLowerCase(); //Remove city duplicate in lower case from DS

          //remove city state zip from address line. Keep only street 
          var deliveryAddressSubStringThird = deliveryAddressSubStringInitial
            .replace(deliveryCity, "")
            .replace(deliveryState, "")
            .replace(deliveryAddressZipMatch, "")
            .replace(deliveryCityAllLower, "")
            .replace(",", "")
            .trim();

          //check if address is available
          var isAddressOnDeliveryAvailable = deliveryAddressSubStringThird.search(
            "DISPATCHER"
          );

          if (isAddressOnDeliveryAvailable > 0) {
            deliveryAddress = "CONTACT DISPATCHER";
          } else {
            var deliveryAddress = deliveryAddressSubStringThird.trim();
          }
        }

        //check how many phones in order

        

        var phonesOnDeliveryCount = (
          pickupPhoneSubstringInitial.match(/Phone/g) || []
        ).length;


        //if more than 1 phone in order:
        if (phonesOnDeliveryCount > 1) {
          var deliveryPhonesSplit = deliveryPhoneSubstringInitial.split(
            "Phone"
          );
          deliveryPhonesSplit.shift();
          var formattedPhonesOnDelivery = [];
          deliveryPhonesSplit.forEach((element) => {
            var formattedPhone = element.split(":").pop();
            formattedPhonesOnDelivery.push(formattedPhone);
          });
          deliveryPhone = formattedPhonesOnDelivery.pop();
        } else {
          // check if phone is available
          var isPhoneOnDeliveryAvailable = deliveryPhoneSubstringInitial.search(
            "DISPATCHER"
          );

          if (isPhoneOnDeliveryAvailable > 0) {
            deliveryPhone = "CONTACT DISPATCHER";
          } else {
            var deliveryPhone = deliveryPhoneSubstringInitial
              .substring(deliveryPhoneSubstringInitial.indexOf(":") + 1)
              .trim();
          }
        }

      } catch (error) {
        console.log(error, "error inside Delivery");
      }

      //PAYMENT ==============================================================
      try {

        //Total payment

        var totalPaymentSubString = paymentInformation.substring(
          paymentInformation.lastIndexOf("Total Payment"),
          paymentInformation.lastIndexOf("On Delivery to Carrier")
        );
        var totalPayment = totalPaymentSubString.replace(
          "Total Payment to Carrier:",
          ""
        ).trim();

        var totalPaymentInNumber = parseFloat(
          totalPayment.slice(1).replace(",", "")
        ); //remove $ sign, semicolon and parse into Int

        //payment on delivery. Not in use. For future needs
        var paymentOnDelivery = paymentInformation
          .substring(paymentInformation.lastIndexOf("On Delivery to Carrier"),
          paymentInformation.lastIndexOf("Carrier owes Company"))
          .trim();
        var paymentOnDeliveryInNumber = paymentOnDelivery
          .slice(1)
          .replace(",", ""); //remove $ sign, semicolon and parse into Int

        //Broker owes Carrier after COD or COP . Not in use. For future needs
        // var companyOwesPayment = paymentInformationSplitByLines[3].substring(
        //   paymentInformationSplitByLines[3].indexOf(":") + 1
        // );

        //Check if COD. Then define the Payment terms

        var isCODasPaymentTerm = paymentInformation.search("COD");
        var isCOPasPaymentTerm = paymentInformation.search("COP");

        if (isCODasPaymentTerm > 0) {
          var paymentTerms = PaymentTerms.COD;
        } else if (isCOPasPaymentTerm > 0) {
          var paymentTerms = PaymentTerms.COP;
        } else {
          var paymentTerms = paymentInformation
            .substring(
              paymentInformation.lastIndexOf("within"),
              paymentInformation.lastIndexOf("business")
            )
            .match(/ \d+/g)[0]
            .trim();
        }

        //check type of payment

        if (
          paymentTerms === PaymentTerms.COD ||
          paymentTerms === PaymentTerms.COP
        ) {
          var paymentMethod = PaymentMethods.CASH;

        //Check if there is broker fee

        var isCarrierOwesCompany = paymentInformation.match(
          /Carrier.*owes.*Company/
        );
        if (isCarrierOwesCompany) {
          //payment on delivery
          var paymentOnDelivery = paymentInformation
            .substring(
              paymentInformation.lastIndexOf("Carrier owes Company"),
              paymentInformation.indexOf("after")
            )
            .trim()
            .replace("Carrier owes Company**:", "")
            .replace("$", "")
          var brokerFee = paymentOnDelivery
            .replace(",", ""); //remove $ sign, semicolon and parse into Int
        }

        } else {
          var paymentMethodInitialData = paymentInformation.substring(
            paymentInformation.lastIndexOf("Payment will be made with")
          );

          var isPaymentMethodCertifiedFunds = paymentMethodInitialData.search(
            "Certified"
          );
          var isPaymentMethodCompanyCheck = paymentMethodInitialData.search(
            "Company"
          );

          if (isPaymentMethodCertifiedFunds > 0) {
            var paymentMethod = PaymentMethods.CERTIFIED_FUNDS;
          } else if (isPaymentMethodCompanyCheck > 0) {
            var paymentMethod = PaymentMethods.COMPANY_CHECK;
          }
        }
      } catch (error) {
        console.log(error, "error inside Payment");
      }

      //check payment Terms

      if (paymentTerms === PaymentTerms.COD) {
        var paymentStartUpon = PaymentStartUpon.DELIVERY;
      } else if (paymentTerms === PaymentTerms.COP) {
        var paymentStartUpon = PaymentStartUpon.PICKUP;
      } else  {
        var paymentTermsBillOfLadingExistsCheck = paymentInformation.search(
          "Bill"
        );
        var paymentTermsDeliveryExists = paymentInformationTerms.search("delivery")
        if (paymentTermsBillOfLadingExistsCheck > 0) {
          var paymentStartUpon = PaymentStartUpon.RECEIVING_BOL;
        } else if (paymentTermsDeliveryExists > 0) {
          var paymentStartUpon = PaymentStartUpon.DELIVERY
        }
      }

      //VEHICLES ===================================================================

      let vehiclesArray = [];
      try {
        for (let vehicle of vehicleInformationSplitByLines) {
          var vehicleDataArray = vehicle.split(" ");
          var vehicleYear = vehicleDataArray[0];
          //make
          var initialVehicleName = vehicleDataArray[1];
          var initialVehicleNameToUpper = initialVehicleName.toUpperCase();

          var foundMake = makes.filter((make) => {
            return make.make.includes(initialVehicleNameToUpper);
          })[0];

          if (foundMake) {
            var vehicleMake = foundMake.make;
          } else {
            var vehicleMake = initialVehicleName;
            var isVehicleRecognitionError = true;
          }

          //MODEL
          //find index of vehicle type in order to find vehicle model which is just before Type
          var indexOfVehicleType = vehicleDataArray.findIndex(
            (element) =>
              element.includes("SUV") ||
              element.includes("Pickup") ||
              element.includes("Van") ||
              element.includes("Car")
          ); //find an index of an elment in array which contains word Color

          var vehicleModel = vehicleDataArray
            .slice(2, indexOfVehicleType)
            .join()
            .replace("Type:", "");

          //TYPE
          var isCarType = vehicle.search("Car");
          var isPickupType = vehicle.search("Pickup");
          var isSUVtype = vehicle.search("SUV");
          var isVanType = vehicle.search("Van");

          if (isCarType > 0) {
            var vehicleType = CarTypes.CAR;
          } else if (isPickupType > 0) {
            var vehicleType = CarTypes.PICKUP;
          } else if (isSUVtype > 0) {
            var vehicleType = CarTypes.SUV;
          } else if (isVanType > 0) {
            var vehicleType = CarTypes.VAN;
          }

          //VIN
          var vehicleVin = vehicle
            .substring(vehicle.indexOf("VIN:"), vehicle.lastIndexOf("Lot"))
            .replace("VIN:", "");

          //lot
          var vehicleLot = vehicle
            .substring(
              vehicle.lastIndexOf("Lot #:"),
              vehicle.lastIndexOf("Additional")
            )
            .replace("Lot #:", "");

          let newVehicle = {
            vin: vehicleVin,
            year: vehicleYear,
            make: vehicleMake,
            model: vehicleModel,
            type: vehicleType,
            color: "",
            plate: "",
            lotNumber: vehicleLot,
            additionalInfo: "",
            isVehicleRecognitionError: isVehicleRecognitionError,
          };
          vehiclesArray.push(newVehicle);
        }
      } catch (error) {
        console.log(error, "error in vehicles");
      }

      //dates
      try {
        var pickupDate = datesInformationSplitByLines[1]
          .substring(datesInformationSplitByLines[1].indexOf(":") + 1)
          .trim();

        var pickupDateConverted = pickupDate.split("/");

        var pickupDateConvertedFormat = [
          pickupDateConverted[2],
          pickupDateConverted[0],
          pickupDateConverted[1],
        ].join("-");

        var deliveryDate = datesInformationSplitByLines[2]
          .substring(datesInformationSplitByLines[2].indexOf(":") + 1)
          .trim();

        var deliveryDateConverted = deliveryDate.split("/");

        var deliveryDateConvertedFormat = [
          deliveryDateConverted[2],
          deliveryDateConverted[0],
          deliveryDateConverted[1],
        ].join("-");
      } catch (error) {
        console.log(error, "error in dates");
      }

      let newUploadedObject = {
        shipperOrderId: shipperOrderId,
        pickupPhone: pickupPhone,
        pickupMultiplePhones: formattedPhonesOnPickup
          ? formattedPhonesOnPickup
          : "",
        pickupAddress: pickupAddress,
        pickupZip: pickupZip,
        pickupCity: pickupCity,
        pickupState: pickupState,
        pickupBusinessName: pickupBusinessName,
        pickupContactName: pickupContactName,
        buyerNumber: buyerNumber,
        deliveryPhone: deliveryPhone,
        deliveryMultiplePhones: formattedPhonesOnDelivery
          ? formattedPhonesOnDelivery
          : "",
        deliveryAddress: deliveryAddress,
        deliveryZip: deliveryZip,
        deliveryCity: deliveryCity,
        deliveryState: deliveryState,
        deliveryContactName: deliveryContactName,
        deliveryBusinessName: deliveryBusinessName,
        shipperName: shipperName,
        shipperAddress: shipperAddress,
        shipperContactName: shipperZip,
        shipperPhone: shipperPhone,
        shipperContactName: shipperContactName,
        shipperZip: shipperZip,
        shipperCity: shipperCity,
        shipperState: shipperState,
        orderAmount: totalPaymentInNumber,
        paymentTerms: paymentTerms,
        paymentMethod: paymentMethod,
        paymentStartUpon: paymentStartUpon,
        vehiclesArray: vehiclesArray,
        orderInstructions: instructionInformation,
        pickupDate: pickupDateConvertedFormat,
        deliveryDate: deliveryDateConvertedFormat,
        isDeliveryZipError: isDeliveryZipError,
        isPickupZipError: isPickupZipError,
        brokerFee: brokerFee? brokerFee : ""
      };

      res.status(200).send(newUploadedObject);
      return resolve();
    });
  }
};

const getGoogleCoordinates = async (zipToCoordinate) => {
  let coordinates = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCYhmug_bUhafqhlnoM_8GIHRcFz_iel4c&components=postal_code:${zipToCoordinate}`
  );

  return coordinates.data.results[0].formatted_address;
};


const zipCheck = (zip) => {
  let isnum = /^\d+$/.test(zip);

  if (zip.length  >=5 && isnum ) {
    return true
  } else {
    return false
  }
}