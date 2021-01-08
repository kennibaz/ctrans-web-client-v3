import firebase from "../../../firebase/firebase-adm";

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
    activityStatus: "Order changed",
    activityUser: "dispatcher",
  };

  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({
      "pickup.pickupScheduledFirstDate": scheduledPickupDate,

      "pickup.pickupAddress.address": address,
      "pickup.pickupAddress.city": city,
      "pickup.pickupAddress.state": state,
      "pickup.pickupAddress.zip": zip,
      "pickup.pickupAddress.businessName": businessName,
      "pickup.pickupAddress.contact_name": contactName,
      "pickup.pickupAddress.email": email,
      "pickup.pickupAddress.phone": phone,
      "pickup.pickupAddress.fax": fax,

      orderActivity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: "order pickup location updated" });
};
