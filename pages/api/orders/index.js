import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
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

      if (!token || !userId || !carrierId) {
        res.status(405).end();
        return;
      }

      let requestArray = [];

      statusNew && requestArray.push("New");
      statusAssigned && requestArray.push("Assigned");
      statusPicked && requestArray.push("Picked");
      statusDelivered && requestArray.push("Delivered");
      statusPaid && requestArray.push("Paid");
      statusAll &&
        requestArray.push("New", "Assigned", "Picked", "Delivered", "Paid");

      let decodedToken;
      try {
        decodedToken = await firebase.auth().verifyIdToken(token);
      } catch (err) {
        console.log(err);
        res.status(500).end();
        return;
      }

      if (token && decodedToken.uid !== userId) {
        res.status(500).end();
        return;
      }

      var orderRef = firebase
        .firestore()
        .collection("carriers-records")
        .doc(carrierId)
        .collection("orders")
        .where("orderStatus", "!=", "Archived");
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
            if (order.data.orderStatus === status) {
              filtered_array.push(order);
            }
          });
        });
        if (selectedDriver) {
          filteredArrayByDriver = filtered_array.filter((order) => {
            return order.data.roles.driverId === selectedDriver;
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
