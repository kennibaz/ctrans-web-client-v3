import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import {Responds} from "../../../utils/responds"
import { Roles } from "../../../utils/roles";

export default async (req, res) => {
  const {
    carrierId,
    orderId,
    scheduledPickupDate,
    address,
    city,
    state,
    zip,
    businessName,
    contactName,
    email,
    phone,
    fax,
  } = req.body;

  if (!carrierId || !orderId) {
    res.status(405).end();
    return;
  }

  const createdAt = firebase.firestore.Timestamp.now();

  const new_activity = {
    activityDate: createdAt,
    activityStatus: "Order pickup location was updated",
    activityUser: Roles.DISPATCHER,
  };

  firebase
    .firestore()
    .collection(Constants.CARRIERS_RECORDS)
    .doc(carrierId)
    .collection(Constants.ORDERS)
    .doc(orderId)
    .update({
      "pickup.pickupScheduledFirstDate": scheduledPickupDate,
      "pickup.pickupAddress.address": address,
      "pickup.pickupAddress.city": city,
      "pickup.pickupAddress.state": state,
      "pickup.pickupAddress.zip": zip,
      "pickup.pickupAddress.businessName": businessName,
      "pickup.pickupAddress.contactName": contactName,
      "pickup.pickupAddress.email": email,
      "pickup.pickupAddress.phone": phone,
      "pickup.pickupAddress.fax": fax,

      orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: Responds.PICKUP_LOCATION_UPDATED});
};
