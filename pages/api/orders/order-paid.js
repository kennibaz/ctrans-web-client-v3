import { isResSent } from "next/dist/next-server/lib/utils";
import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
 
  const {
    carrierId,
    orderId,
  } = req.body;

  if(!carrierId|| !orderId){
    res.status(405).end()
    return;
  }
  

  firebase.firestore().collection("carriers-records")
  .doc(carrierId)
  .collection("orders")
  .doc(orderId)
  .update({
    orderStatus: "Paid",
  });

  res.status(200).json({ status: "order cancelled" });
};
