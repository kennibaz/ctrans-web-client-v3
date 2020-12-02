import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
 
  const {
    carrierId,
    orderId,
  } = req.body;
  

  firebase.firestore().collection("carriers-records")
  .doc(carrierId)
  .collection("orders")
  .doc(orderId)
  .update({
    order_status: "Cancelled",
  });

  res.status(200).json({ status: "order cancelled" });
};
