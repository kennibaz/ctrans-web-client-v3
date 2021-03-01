import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { loadStatus } from "../../../utils/status";
import {Roles} from "../../../utils/roles"
import { Responds } from "../../../utils/responds";

export default async (req, res) => {
  const {
    carrierId,
    orderId,
    driverId,
    driverName,
  } = req.body;

  if (!carrierId || !orderId || !orderId) {
    return;
  }

  const createdAt = firebase.firestore.Timestamp.now();
  const orderRef = firebase
    .firestore()
    .collection(Constants.CARRIERS_RECORDS)
    .doc(carrierId)
    .collection(Constants.ORDERS)
    .doc(orderId);

  const orderData = (await orderRef.get()).data();
  const currentOrderStatus = orderData.orderStatus;

  const newActivity = {
    activityDate: createdAt,
    activityStatus: `${driverName} assigned`,
    activityUser: Roles.DISPATCHER,
  };

  if (currentOrderStatus === loadStatus.NEW) {
    orderRef.update({
      "roles.driverId": driverId,
      "usersNames.driverName": driverName,
      orderStatus: loadStatus.ASSIGNED,
      orderActivity: firebase.firestore.FieldValue.arrayUnion(newActivity),
    });
    res.status(200).json({ status: Responds.DRIVER_ASSIGNED });
    return;
  }

  orderRef.update({
    "roles.driverId": driverId,
    "usersNames.driverName": driverName,
    orderActivity: firebase.firestore.FieldValue.arrayUnion(newActivity),
  });
  res.status(200).json({ status: Responds.DRIVER_ASSIGNED });
};
