import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { loadStatus } from "../../../utils/status";

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

      statusNew && requestArray.push(loadStatus.NEW);
      statusAssigned && requestArray.push(loadStatus.ASSIGNED);
      statusPicked && requestArray.push(loadStatus.PICKED);
      statusDelivered && requestArray.push(loadStatus.DELIVERED);
      statusPaid && requestArray.push(loadStatus.PAID);
      statusAll &&
        requestArray.push(loadStatus.NEW, loadStatus.ASSIGNED, loadStatus.PICKED, loadStatus.DELIVERED, loadStatus.PAID);

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

      var requestRef = firebase
        .firestore()
        .collection(Constants.CARRIERS_RECORDS)
        .doc(carrierId)
        .collection(Constants.ORDERS)
        .where("orderStatus", "!=", loadStatus.ARCHIVED);
      let downloadedOrdersFromFS = [];
      let filtered_array = [];
      let filteredArrayByDriver = [];

      try {
        const requestData = await requestRef.get();
        requestData.forEach(function (doc) {
          let nextOrder = {
            id: doc.id,
            data: doc.data(),
          };
          downloadedOrdersFromFS.push(nextOrder);
        });
        requestArray.forEach((status) => {
          downloadedOrdersFromFS.forEach((order) => {
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
