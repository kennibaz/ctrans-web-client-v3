import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  const { carrierId, orderId, shipperOrderId, driverName } = req.body;

  if (!carrierId || !orderId) {
    res.status(405).end();
    return;
  }

  const createdAt = new Date();
  const new_activity = {
    activityDate: createdAt,
    activityStatus: `${driverName} unassigned`,
    activityUser: "dispatcher",
  };
  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({
      "roles.driverId": "",
      "usersNames.driverName": "",
      orderStatus: "New",
      orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: "driver unassigned" });
};
