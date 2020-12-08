import firebase from "../../../firebase/firebase-adm";
const nodemailer = require("nodemailer");



export default async (req, res) => {
    const {
        email,
        orderId,
        carrierId,
        orderShipperInnerId,
      } = req.body;

      const sendMail= async (
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
      const invoice = orderDoc.order_payment.invoice_uri
      if (invoice) {
        const fileName = `invoice_${order_shipper_inner_id}.pdf`;
        sendMail(
            email,
            `Your invoice for order ${order_shipper_inner_id}` ,
            "Please find your invoice attached",
            fileName,
            invoice
        );
      }
     
}