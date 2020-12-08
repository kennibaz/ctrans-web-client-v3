import firebase from "../../../firebase/firebase-adm";
const nodemailer = require("nodemailer");



export default async (req, res) => {
    const {
        email,
        orderId,
        carrierId,
        orderShipperInnerId,
      } = req.body;

      const sendMailLocalFunctionGeneral= async (
        email,
        subject,
        text,
        filename,
        attachment
      ) => {
        const transporter = nodemailer.createTransport({
          host: "smtp.zoho.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: `admin@centraltransporter.com`, // generated ethereal user
            pass: "Noxnoxnox456!", // generated ethereal password
          },
        });
        var serviceMessage = {
          from: "admin@centraltransporter.com",
          to: email,
          subject: subject,
          text: text,
          attachments: [
            {
              filename: filename,
              path: attachment,
            },
          ],
        };
        transporter.sendMail(serviceMessage, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return;
      }





      console.log(req.body);
      const orderRef = firebase
        .firestore()
        .collection("carriers-records")
        .doc(carrierId)
        .collection("orders")
        .doc(orderId);
      const orderData = await orderRef.get();
      const orderDoc = orderData.data();
      const orderBolPickup = orderDoc.order_bol.pickup_BOL;
      const orderBolDelivery = orderDoc.order_bol.delivery_BOL;
      if (!orderBolDelivery) {
        const fileName = `pickup_BOL_${orderShipperInnerId}.pdf`;
        sendMailLocalFunctionGeneral(
          email,
          "Your Pickup BOL",
          "Please find your Pickup BOL attached",
          fileName,
          orderBolPickup
        );
      }
      if (orderBolDelivery) {
        const fileName = `delivery_BOL_${orderShipperInnerId}.pdf`;
        sendMailLocalFunctionGeneral(
          email,
          "Your Delivery BOL",
          "Please find your Delivery BOL attached",
          fileName,
          orderBolDelivery
        );
      }
}