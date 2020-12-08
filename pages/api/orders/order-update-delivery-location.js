import firebase from "../../../firebase/firebase-adm";

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

  const created_at = firebase.firestore.Timestamp.now();

  const new_activity = {
    activity_date: created_at,
    activity_status: "Order changed",
    activity_user: "dispatcher",
  };

  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({
      "delivery.delivery_scheduled_first_date": scheduledDeliveryDate,

      "delivery.delivery_address.address": address,
      "delivery.delivery_address.city": city,
      "delivery.delivery_address.state": state,
      "delivery.delivery_address.zip": zip,
      "delivery.delivery_address.business_name": businessName,
      "delivery.delivery_address.contact_name": contactName,
      "delivery.delivery_address.email": email,
      "delivery.delivery_address.phone": phone,
      "delivery.delivery_address.fax": fax,

      order_activity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: "order delivery location updated" });
};
