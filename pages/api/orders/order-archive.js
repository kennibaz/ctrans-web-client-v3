import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  const { carrierId, orderId } = req.body;

  if (!carrierId || !orderId) {
    return;
  }

  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({
      orderStatus: "Archived",
    });

  res.status(200).json({ status: "order archived" });
};
