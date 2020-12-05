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

  const created_at = new Date();

  const new_activity = {
    activity_date: created_at,
    activity_type: "Location was changed",
    activity_user: "dispatcher",
    activity_log: `Location was chenged at ${created_at}`,
  };

  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({
      "pickup.pickup_scheduled_first_date": scheduledPickupDate,

      "pickup.pickup_address.address": address,
      "pickup.pickup_address.city": city,
      "pickup.pickup_address.state": state,
      "pickup.pickup_address.zip": zip,
      "pickup.pickup_address.business_name": businessName,
      "pickup.pickup_address.contact_name": contactName,
      "pickup.pickup_address.email": email,
      "pickup.pickup_address.phone": phone,
      "pickup.pickup_address.fax": fax,

      order_activity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: "order pickup location updated" });
};