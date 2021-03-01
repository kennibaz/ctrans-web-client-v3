import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import {Responds} from "../../../utils/responds"
import { Roles } from "../../../utils/roles";

export default async (req, res) => {
  const {
    carrierId,
    orderId,
    scheduledDeliveryDate,
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

  if(!carrierId|| !orderId){
    res.status(405).end()
    return;
  }

  const createdAt = firebase.firestore.Timestamp.now();

  const new_activity = {
    activityDate: createdAt,
    activityStatus: "Order delivery location was updated",
    activityUser: Roles.DISPATCHER,
  };

  firebase
    .firestore()
    .collection(Constants.CARRIERS_RECORDS)
    .doc(carrierId)
    .collection(Constants.ORDERS)
    .doc(orderId)
    .update({
      "delivery.deliveryScheduledFirstDate": scheduledDeliveryDate,
      "delivery.deliveryAddress.address": address,
      "delivery.deliveryAddress.city": city,
      "delivery.deliveryAddress.state": state,
      "delivery.deliveryAddress.zip": zip,
      "delivery.deliveryAddress.businessName": businessName,
      "delivery.deliveryAddress.contactName": contactName,
      "delivery.deliveryAddress.email": email,
      "delivery.deliveryAddress.phone": phone,
      "delivery.deliveryAddress.fax": fax,

      orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: Responds.DELIVERY_LOCATION_UPDATED });
};
