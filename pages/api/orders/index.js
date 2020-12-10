import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  // if (req.method === "GET") {
  //   return new Promise(async (resolve) => {
  //     var orderRef = firebase
  //       .firestore()
  //       .collection("carriers-records")
  //       .doc("1840b8a5-3381-41f7-9838-8ad23a7b50bd")
  //       .collection("orders")
  //       .where("order_status", "!=", "Archived");
  //     let new_array = [];

  //     try {
  //       const orderData = await orderRef.get();
  //       orderData.forEach(function (doc) {
  //         let new_obj = {
  //           id: doc.id,
  //           data: doc.data(),
  //         };
  //         new_array.push(new_obj);
  //       });
  //     } catch (error) {
  //       console.log(error); // Can be a simple console.error too
  //       res.status(500).end();
  //       return resolve();
  //     }
  //     res.status(200).send(new_array);
  //     return resolve();
  //   });
  // }

  if (req.method === "POST") {
    return new Promise(async (resolve) => {
      const {
        carrierId,
        statusAll,
        statusNew,
        statusAssigned,
        statusPicked,
        statusDelivered,
        statusPaid,
        selectedDriver,
        token,
        userId,
      } = req.body;

      if(!token || !userId || !carrierId){
        res.status(405).end()
        return
      }

      let requestArray = [];
      let decodedToken;

      statusNew && requestArray.push("New");
      statusAssigned && requestArray.push("Assigned");
      statusPicked && requestArray.push("Picked");
      statusDelivered && requestArray.push("Delivered");
      statusPaid && requestArray.push("Paid");
      statusAll &&
        requestArray.push("New", "Assigned", "Picked", "Delivered", "Paid");
      try {
        decodedToken = await firebase.auth().verifyIdToken(token);
      } catch (err) {
        console.log(err);
        res.status(500).end()
        return
      }

      if (token && decodedToken.uid !== userId) {
        res.status(500).end()
        return;
      }

      var orderRef = firebase
        .firestore()
        .collection("carriers-records")
        .doc(carrierId)
        .collection("orders")
        .where("order_status", "!=", "Archived");
      let new_array = [];
      let filtered_array = [];
      let filteredArrayByDriver = [];

      try {
        const orderData = await orderRef.get();
        orderData.forEach(function (doc) {
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
        if (selectedDriver) {
          filteredArrayByDriver = filtered_array.filter((order) => {
            return order.data.roles.driver_system_id === selectedDriver;
          });
        }
      } catch (error) {
        console.log(error); // Can be a simple console.error too
        res.status(500).end();
        return resolve();
      }

      if (selectedDriver) {
        res.status(200).send(filteredArrayByDriver);
        return resolve();
      }

      res.status(200).send(filtered_array);
      return resolve();
    });
  }
};
