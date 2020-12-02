import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  if (req.method === "GET") {
    var orderRef = firebase.firestore()
      .collection("carriers-records")
      .doc("1840b8a5-3381-41f7-9838-8ad23a7b50bd")
      .collection("orders");
    let new_array = [];
    orderRef
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let new_obj = {
            id: doc.id,
            data: doc.data(),
          };
          new_array.push(new_obj);
        });
        res.json(new_array);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
  if (req.method === "POST") {
    const {
      statusAll,
      statusNew,
      statusAssigned,
      statusPicked,
      statusDelivered,
      statusPaid,
    } = req.body;

    let requestArray = [];

    statusNew && requestArray.push("New");
    statusAssigned && requestArray.push("Assigned");
    statusPicked && requestArray.push("Picked");
    statusDelivered && requestArray.push("Delivered");
    statusPaid && requestArray.push("Paid");
    statusAll && requestArray.push("New","Assigned", "Picked","Delivered", "Paid" );


    var orderRef = firebase.firestore()
      .collection("carriers-records")
      .doc("1840b8a5-3381-41f7-9838-8ad23a7b50bd")
      .collection("orders");
    let new_array = [];
    let filtered_array = [];
    orderRef
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let new_obj = {
            id: doc.id,
            data: doc.data(),
          };
          new_array.push(new_obj);
        });
        requestArray.forEach((status) => {
          new_array.forEach((order) => {
            if (order.data.order_status === status) {
              filtered_array.push(order);
            }
          });
        });
        res.json(filtered_array);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
};
