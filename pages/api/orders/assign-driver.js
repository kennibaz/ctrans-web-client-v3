import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {

const {carrierId, orderId,driverId, order_shipper_inner_id, driverName } = req.body 


    const created_at = new Date();
    const orderRef = firebase.firestore()
      .collection("carriers-records")
      .doc(carrierId)
      .collection("orders")
      .doc(orderId);

    const orderData = (await orderRef.get()).data();
    const currentOrderStatus = orderData.order_status;



    const new_activity = {
      activity_date: created_at,
      activity_type: "order_assigned_to_driver",
      activity_user: "dispatcher",
      activity_log: `Order "${order_shipper_inner_id}" assigned to driver "${driverName}" at ${created_at}`,
    };

    if (currentOrderStatus === "New") {
      orderRef.update({
        "roles.driver_system_id": driverId,
        "users_names.driver_name":
          driverName,
        order_status: "Assigned",
        order_activity: firebase.firestore.FieldValue.arrayUnion(new_activity),
      });
      res.status(200).json({status: "driver assigned"})
      return;
    }

    orderRef.update({
      "roles.driver_system_id": driverId,
      "users_names.driver_name":
      driverName,
      order_activity: firebase.firestore,
      order_activity: firebase.firestore.FieldValue.arrayUnion(new_activity),
    });
    console.log("ok")
    res.status(200).json({status: "driver assigned"})

    
}