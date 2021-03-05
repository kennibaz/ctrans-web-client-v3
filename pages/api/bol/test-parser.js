import { ContactsOutlined } from "@material-ui/icons";
import { makes } from "../../../src/makes";

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
      var phoneNumberPatternInAddress = / \d+/g;
      var yearNumberPatternInVehicle = /\d+/g;
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

      var resultDataSplitByLines = resultData.split("\n");

      //////Second split blocks by lines

      var pickupInformationSplitByLines = pickupInformation.split("\n");
      var deliveryInformationSplitByLines = deliveryInformation.split("\n");
      var paymentInformationSplitByLines = paymentInformation.split("\n");
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
        console.log(newVehicle)
  
        vehiclesArray.push(newVehicle)
      }

      let newUploadedObject = {
        shipperOrderId: shipperOrderId,
        pickupPhone: pickupPhone,
        pickupAddress: pickupAddress,
        pickupZip: pickupZip,
        pickupContactName: pickupContactName,
        deliveryPhone: deliveryPhone,
        deliveryAddress: deliveryAddress,
        deliveryZip: deliveryZip,
        deliveryContactName: deliveryContactName,
        shipperName: shipperName,
        shipperAddress: shipperAddress,
        shipperContactName: shipperZip,
        shipperPhone: shipperPhone,
        shipperContactName: shipperContactName,
        orderAmount: totalPaymentInNumber,
        paymentTerms: paymentTerms,
        paymentMethod: paymentMethod,
        paymentStartUpon: "",
        vehicles: vehiclesArray,
      };

      console.log(newUploadedObject);
      res.status(200).send(newUploadedObject);
      return resolve();
    });
  }
};
