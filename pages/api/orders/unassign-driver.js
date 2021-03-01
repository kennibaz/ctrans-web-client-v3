import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { loadStatus } from "../../../utils/status";
import {Responds} from "../../../utils/responds"
import { Roles } from "../../../utils/roles";

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
    activityUser: Roles.DISPATCHER,
  };
  firebase
    .firestore()
    .collection(Constants.CARRIERS_RECORDS)
    .doc(carrierId)
    .collection(Constants.ORDERS)
    .doc(orderId)
    .update({
      "roles.driverId": "",
      "usersNames.driverName": "",
      orderStatus: loadStatus.NEW,
      orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: Responds.DRIVER_UNASSIGNED });
};
