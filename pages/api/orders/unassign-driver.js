import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  const {
    carrierId,
    orderId,
    order_shipper_inner_id,
    driverName,
  } = req.body;

  const created_at = new Date();
  const new_activity = {
    activity_date: created_at,
    activity_type: "order_unassigned_from_driver",
    activity_user: "dispatcher",
    activity_log: `Order "${order_shipper_inner_id}" was unassigned from driver "${driverName}" at ${created_at}`,
  };
  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({
      "roles.driver_system_id": "",
      "users_names.driver_name": "",
      order_status: "New",
      order_activity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });

  res.status(200).json({ status: "driver unassigned" });
};
