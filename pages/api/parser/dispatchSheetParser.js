import {
  ContactsOutlined,
  LocalConvenienceStoreOutlined,
} from "@material-ui/icons";
import { makes } from "../../../src/makes";
import { PaymentStartUpon } from "../../../utils/constants";
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
          resultData.lastIndexOf("DISPATCH INSTRUCTIONS")
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

      //shipper
      try {
        var shipperNamePartsplitByLines = shipperInformation
          .substring(0, shipperInformation.lastIndexOf("Co. Phone"))
          .split("\n");
        var shipperContactPartSplitByLines = shipperInformation
          .substring(shipperInformation.lastIndexOf("Contact:"))
          .split("\n");
        var shipperName = shipperNamePartsplitByLines
          .slice(1, -3)
          .join(" ")
          .trim(); //get rid of Dispatch word and address and join them together

        var shipperAddress = shipperNamePartsplitByLines.slice(-3, -2)[0];
        var shipperZip = shipperNamePartsplitByLines
          .slice(-2, -1)[0]
          .match(zipNumberPatternInAddress)[0];
        var shipperContactName = shipperContactPartSplitByLines[0]
          .substring(shipperContactPartSplitByLines[0].indexOf(":") + 1)
          .trim();

        var shipperPhone = shipperContactPartSplitByLines[1]
          .substring(shipperContactPartSplitByLines[1].indexOf(":") + 1)
          .trim();

        var shipperOrderId = resultDataSplitByLines[2]
          .substring(resultDataSplitByLines[2].indexOf(":") + 1)
          .trim();

        var shipperAddress2 = await getGoogleCoordinates(shipperZip);
        var shipperAddress2Split = shipperAddress2.split(",");
        var shipperCity = shipperAddress2Split[0];
        var shipperState = shipperAddress2Split[1].trim().slice(0, 2);
      } catch (error) {
        console.log(error, "Error in shipper");
      }

      //pickup

      try {
        console.log(pickupInformationSplitByLines);
        //check if Contact name is available
        var isContactNameOnPickupAvailable = pickupInformationSplitByLines[1].search(
          "DISPATCHER"
        );
        if (isContactNameOnPickupAvailable > 0) {
          pickupContactName = "CONTACT DISPATCHER";
        } else {
          var pickupContactName = pickupInformationSplitByLines[1]
            .substring(
              pickupInformationSplitByLines[1].indexOf(":") + 1,
              pickupInformationSplitByLines[1].indexOf("(")
            )
            .trim();
        }

        //check ib business name is available

        var isBusinessNameOnPickupAvailableCheck1 = pickupInformationSplitByLines[1].includes(
          "("
        );
        var isBusinessNameOnPickupAvailableCheck2 = pickupInformationSplitByLines[1].includes(
          ")"
        );

        if (
          isBusinessNameOnPickupAvailableCheck1 &&
          isBusinessNameOnPickupAvailableCheck2
        ) {
          var pickupBusinessName = pickupInformationSplitByLines[1]
            .substring(
              pickupInformationSplitByLines[1].indexOf("(") + 1,
              pickupInformationSplitByLines[1].indexOf(")")
            )
            .trim();
        } else pickupBusinessName = "Not Available";

        //check if address is available
        var isAddressOnPickupAvailable = pickupInformationSplitByLines[2].search(
          "DISPATCHER"
        );
        if (isAddressOnPickupAvailable > 0) {
          pickupAddress = "CONTACT DISPATCHER";
        } else {
          var pickupAddress = pickupInformationSplitByLines[2].trim();
        }

        var pickupZip = pickupInformationSplitByLines[3]
          .match(zipNumberPatternInAddress)[0]
          .trim();

        //check how many phones in order

        var phonesOnPickupCount = (
          pickupInformationSplitByLines[4].match(/Phone/g) || []
        ).length;

        console.log(phonesOnPickupCount)

        if (phonesOnPickupCount > 1) {
          var pickupPhonesSplit = pickupInformationSplitByLines[4].split(
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

          var isPhoneOnPickupAvailable = pickupInformationSplitByLines[4].search(
            "DISPATCHER"
          );

          if (isPhoneOnPickupAvailable > 0) {
            pickupPhone = "CONTACT DISPATCHER";
          } else {
            var pickupPhone = pickupInformationSplitByLines[4]
              .substring(pickupInformationSplitByLines[4].indexOf(":") + 1)
              .trim();
          }
        }

        var pickupAddress2 = await getGoogleCoordinates(pickupZip);
        var pickupAddress2Split = pickupAddress2.split(",");
        var pickupCity = pickupAddress2Split[0];
        var pickupState = pickupAddress2Split[1].trim().slice(0, 2);
      } catch (error) {
        console.log(error, "error insude Pickup");
      }
      //delivery
      try {
        //check if contact name is available
        var isContactNameOnDeliveryAvailable = deliveryInformationSplitByLines[1].search(
          "DISPATCHER"
        );
        if (isContactNameOnDeliveryAvailable > 0) {
          deliveryContactName = "CONTACT DISPATCHER";
        } else {
          var deliveryContactName = deliveryInformationSplitByLines[1]
            .substring(
              deliveryInformationSplitByLines[1].indexOf(":") + 1,
              deliveryInformationSplitByLines[1].indexOf("(")
            )
            .trim();
        }
        // check if business name is available
        var isBusinessNameOnDeliveryAvailableCheck1 = deliveryInformationSplitByLines[1].includes(
          "("
        );
        var isBusinessNameOnDeliveryAvailableCheck2 = deliveryInformationSplitByLines[1].includes(
          ")"
        );
        if (
          isBusinessNameOnDeliveryAvailableCheck1 &&
          isBusinessNameOnDeliveryAvailableCheck2
        ) {
          var deliveryBusinessName = deliveryInformationSplitByLines[1]
            .substring(
              deliveryInformationSplitByLines[1].indexOf("(") + 1,
              deliveryInformationSplitByLines[1].indexOf(")")
            )
            .trim();
        } else {
          deliveryBusinessName = "Not Available";
        }

        //check if address is available
        var isAddressOnDeliveryAvailable = deliveryInformationSplitByLines[2].search(
          "DISPATCHER"
        );
        if (isAddressOnDeliveryAvailable > 0) {
          deliveryAddress = "CONTACT DISPATCHER";
        } else {
          var deliveryAddress = deliveryInformationSplitByLines[2].trim();
        }

        var deliveryZip = deliveryInformationSplitByLines[3]
          .match(zipNumberPatternInAddress)[0]
          .trim();

        //check how many phones in order

        var phonesOnDeliveryCount = (
          deliveryInformationSplitByLines[4].match(/Phone/g) || []
        ).length;

        if (phonesOnDeliveryCount > 1) {
          var deliveryPhonesSplit = deliveryInformationSplitByLines[4].split(
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

          var isPhoneOnDeliveryAvailable = deliveryInformationSplitByLines[4].search(
            "DISPATCHER"
          );
          if (isPhoneOnDeliveryAvailable > 0) {
            deliveryPhone = "CONTACT DISPATCHER";
          } else {
            var deliveryPhone = deliveryInformationSplitByLines[4]
              .substring(deliveryInformationSplitByLines[4].indexOf(":") + 1)
              .trim();
          }
        }

        var deliveryAddress2 = await getGoogleCoordinates(deliveryZip);
        var deliveryAddress2Split = deliveryAddress2.split(",");
        var deliveryCity = deliveryAddress2Split[0];
        var deliveryState = deliveryAddress2Split[1].trim().slice(0, 2);
      } catch (error) {
        console.log(error, "error inside Delivery");
      }

      //payment
      try {
        var totalPayment = paymentInformationSplitByLines[1]
          .substring(paymentInformationSplitByLines[1].indexOf(":") + 1)
          .trim();
        var totalPaymentInNumber = parseFloat(
          totalPayment.slice(1).replace(",", "")
        ); //remove $ sign, semicolon and parse into Int

        var paymentOnDelivery = paymentInformationSplitByLines[2]
          .substring(paymentInformationSplitByLines[2].indexOf(":") + 1)
          .trim();
        var paymentOnDeliveryInNumber = paymentOnDelivery
          .slice(1)
          .replace(",", ""); //remove $ sign, semicolon and parse into Int

        var companyOwesPayment = paymentInformationSplitByLines[3].substring(
          paymentInformationSplitByLines[3].indexOf(":") + 1
        );

        var paymentTerms = paymentInformation
          .substring(
            paymentInformation.lastIndexOf("within"),
            paymentInformation.lastIndexOf("business")
          )
          .match(/ \d+/g)[0]
          .trim();

        if (totalPaymentInNumber - paymentOnDelivery == 0) {
          paymentTerms = "Cash";
        } //check if COD, and if is the case - set paymentTerms to CASH

        var paymentMethod = paymentInformation
          .substring(
            paymentInformation.lastIndexOf("Payment will be made with")
          )
          .replace("Payment will be made with", "")
          .replace("Check. ", "Check")
          .replace(/(\r\n|\n|\r)/gm, ""); //remove newline and some text
      } catch (error) {
        console.log(error, "error insude Payment");
      }

      //check payment Terms
      var paymentTermsBillOfLadingExistsCheck = paymentInformation.search(
        "Bill"
      );
      if (paymentTermsBillOfLadingExistsCheck > 0) {
        var paymentStartUpon = PaymentStartUpon.RECEIVING_BOL;
      }

      ///vehicles

      let vehiclesArray = [];
      try {
        for (let vehicle of vehicleInformationSplitByLines) {
          var vehicleDataArray = vehicle.split(" ");

          var vehicleYear = vehicleDataArray[0];
          //make
          var initialVehicleName = vehicleDataArray[1];
          var initialVehicleNameToUpper = initialVehicleName.toUpperCase();
          try {
            var foundMake = makes.find((make, index) => {
              if (make.make.includes(initialVehicleNameToUpper)) return true;
            });
          } catch (error) {
            console.log(error, "wrong make");
          }
          var vehicleMake = foundMake.make;
          if (!foundMake) {
            vehicleMake = initialVehicleName;
          }

          var indexOfVehicleType = vehicleDataArray.findIndex((element) =>
            element.includes("Color")
          ); //find an index of an elment in array which contains word Color
          var vehicleModel = vehicleDataArray
            .slice(2, indexOfVehicleType)
            .join()
            .replace("Type:", "");
          var indexOfColor = vehicleDataArray[indexOfVehicleType].indexOf(
            "Color"
          );
          var vehicleType = vehicleDataArray[indexOfVehicleType].slice(
            0,
            indexOfColor
          );

          var vehicleVin = vehicle
            .substring(vehicle.lastIndexOf("VIN:"), vehicle.lastIndexOf("Lot"))
            .replace("VIN:", "");

          var indexOfLot = vehicleDataArray.findIndex((element) =>
            element.includes("Additional")
          ); //find an index of an elment in array which contains word Additional

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
        deliveryPhone: deliveryPhone,
        deliveryMultiplePhones: formattedPhonesOnDelivery ? formattedPhonesOnDelivery: "",
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
