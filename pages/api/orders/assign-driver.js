import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  const {
    carrierId,
    orderId,
    driverId,
    shipperOrderId,
    driverName,
  } = req.body;

  if (!carrierId || !orderId || !orderId) {
    return;
  }

  const createdAt = firebase.firestore.Timestamp.now();
  const orderRef = firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId);

  const orderData = (await orderRef.get()).data();
  const currentOrderStatus = orderData.orderStatus;

  const new_activity = {
    activityDate: createdAt,
    activityStatus: `${driverName} assigned`,
    activityUser: "Dispatcher",
  };

  if (currentOrderStatus === "New") {
    orderRef.update({
      "roles.driverId": driverId,
      "usersNames.driverName": driverName,
      orderStatus: "Assigned",
      orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });
    res.status(200).json({ status: "driver assigned" });
    return;
  }

  orderRef.update({
    "roles.driverId": driverId,
    "usersNames.driverName": driverName,
    orderActivity: firebase.firestore,
    orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
  });
  console.log("ok");
  res.status(200).json({ status: "driver assigned" });
};
