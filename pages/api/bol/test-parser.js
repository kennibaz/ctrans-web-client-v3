import { ContactsOutlined } from "@material-ui/icons";
import { makes } from "../../../src/makes";
const axios = require("axios");


const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

export default async (req, res) => {
  console.log("inside");
  if (req.method === "POST") {
    return new Promise(async (resolve) => {
      let newPath = path.join(__dirname, "..", "DispatchSheet.pdf");

      let dataBuffer = fs.readFileSync(newPath);

     
      const data = await pdf(dataBuffer);
      

      let resultData = data.text;
      var zipNumberPatternInAddress = / \d+/g;

      // console.log(resultData)

      //Intial Split by blocks
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

      //////Second split blocks by lines

      var pickupInformationSplitByLines = pickupInformation.split("\n");
      var deliveryInformationSplitByLines = deliveryInformation.split("\n");
      var paymentInformationSplitByLines = paymentInformation.split("\n");
      var datesInformationSplitByLines = datesInformation.split("\n")
      var vehicleInformationSplitByLines = vehicleInformation.split("\n");
      //remove last and first elements from vehicles array
      vehicleInformationSplitByLines.shift();
      vehicleInformationSplitByLines.pop();

      vehicleInformationSplitByLines = vehicleInformationSplitByLines.map(
        (element) => element.slice(3)
      );

      //shipper
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

        var shipperAddress2 = await getGoogleCoordinates(shipperZip)
        var shipperAddress2Split = shipperAddress2.split(",")
        var shipperCity = shipperAddress2Split[0]
        var shipperState = shipperAddress2Split[1].trim().slice(0,2)  


//vehicles

      var totalVehiclesInOrder = resultDataSplitByLines[3]
        .substring(resultDataSplitByLines[3].indexOf(":") + 1)
        .trim();


      //pickup

      var pickupContactName = pickupInformationSplitByLines[1]
        .substring(pickupInformationSplitByLines[1].indexOf(":") + 1)
        .trim();
      var pickupAddress = pickupInformationSplitByLines[2].trim();
      var pickupZip = pickupInformationSplitByLines[3]
        .match(zipNumberPatternInAddress)[0]
        .trim();
      var pickupPhone = pickupInformationSplitByLines[4]
        .substring(pickupInformationSplitByLines[4].indexOf(":") + 1)
        .trim();

      var pickupAddress2 = await getGoogleCoordinates(pickupZip)
      var pickupAddress2Split = pickupAddress2.split(",")
      var pickupCity = pickupAddress2Split[0]
      var pickupState = pickupAddress2Split[1].trim().slice(0,2)  
  

      //delivery

      var deliveryContactName = deliveryInformationSplitByLines[1]
        .substring(deliveryInformationSplitByLines[1].indexOf(":") + 1)
        .trim();
      var deliveryAddress = deliveryInformationSplitByLines[2].trim();
      var deliveryZip = deliveryInformationSplitByLines[3]
        .match(zipNumberPatternInAddress)[0]
        .trim();
      var deliveryPhone = deliveryInformationSplitByLines[4]
        .substring(deliveryInformationSplitByLines[4].indexOf(":") + 1)
        .trim();

        var deliveryAddress2 = await getGoogleCoordinates(deliveryZip)
        var deliveryAddress2Split = deliveryAddress2.split(",")
        var deliveryCity = deliveryAddress2Split[0]
        var deliveryState = deliveryAddress2Split[1].trim().slice(0,2)  

      //payment
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
        .substring(paymentInformation.lastIndexOf("Payment will be made with"))
        .replace("Payment will be made with", "")
        .replace("Check. ", "Check")
        .replace(/(\r\n|\n|\r)/gm, ""); //remove newline and some text

      ///vehicles

      let vehiclesArray = [] 
      
      for (let vehicle in vehicleInformationSplitByLines) {
         var vehicleDataArray = vehicleInformationSplitByLines[0].split(" ");
        var vehicleYear = vehicleDataArray[0];
        var initialVehicleName = vehicleDataArray[1];
        var initialVehicleNameToUpper = initialVehicleName.toUpperCase();
        var foundMake = makes.find((make, index) => {
          if (make.make.includes(initialVehicleNameToUpper)) return true;
        });
        var indexOfVehicleType = vehicleDataArray.findIndex((element) =>
          element.includes("Color")
        );
        var vehicleModel = vehicleDataArray
          .slice(2, indexOfVehicleType)
          .join()
          .replace("Type:", "");
        var indexOfColor = vehicleDataArray[indexOfVehicleType].indexOf("Color");
        var vehicleType = vehicleDataArray[indexOfVehicleType].slice(
          0,
          indexOfColor
        );
        var indexOfVin = vehicleDataArray[indexOfVehicleType].substring(
          vehicleDataArray[indexOfVehicleType].indexOf("VIN:"),
          vehicleDataArray[indexOfVehicleType].indexOf("Lot")
        );
  
        let newVehicle = {
          vin: indexOfVin,
          make: foundMake.make,
          model: vehicleModel,
          type: vehicleType,
          color: "",
          plate: "",
          lot: "",
          additionalInfo: "",
        };
        vehiclesArray.push(newVehicle)
      }

      //dates

      var pickupDate = datesInformationSplitByLines[1].substring(
        datesInformationSplitByLines[1].indexOf(":") + 1
      ).trim()

      var pickupDateConverted = pickupDate.split('/')
      var pickupDateConvertedFormat = [pickupDateConverted[2], pickupDateConverted[1], pickupDateConverted[0]].join("-")
      


      var deliveryDate = datesInformationSplitByLines[2].substring(
        datesInformationSplitByLines[2].indexOf(":") +1
      ).trim()

      var deliveryDateConverted = deliveryDate.split('/')
      var deliveryDateConvertedFormat = [deliveryDateConverted[2], deliveryDateConverted[1], deliveryDateConverted[0]].join("-")

      let newUploadedObject = {
        shipperOrderId: shipperOrderId,
        pickupPhone: pickupPhone,
        pickupAddress: pickupAddress,
        pickupZip: pickupZip,
        pickupCity: pickupCity,
        pickupState: pickupState,
        pickupContactName: pickupContactName,
        deliveryPhone: deliveryPhone,
        deliveryAddress: deliveryAddress,
        deliveryZip: deliveryZip,
        deliveryCity: deliveryCity,
        deliveryState: deliveryState,
        deliveryContactName: deliveryContactName,
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
        paymentStartUpon: "",
        vehiclesArray: vehiclesArray,
        orderInstructions: instructionInformation,
        pickupDate: pickupDateConvertedFormat,
        deliveryDate: deliveryDateConvertedFormat
      };

      console.log(newUploadedObject);
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
}