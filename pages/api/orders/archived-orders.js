import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { loadStatus } from "../../../utils/status";

export default async (req, res) => {
  if (req.method === "POST") {
    return new Promise(async (resolve) => {
      const {
        carrierId,
        selectedDriver,
        token,
        userId,
      } = req.body;

      //Check if all fields in request
      if (!token || !userId || !carrierId) {
        res.status(405).end();
        return;
      }

      //decode token in FS
      let decodedToken;
      try {
        decodedToken = await firebase.auth().verifyIdToken(token);
      } catch (err) {
        console.log(err);
        res.status(500).end();
        return;
      }

      //check if user is authorized
      if (token && decodedToken.uid !== userId) {
        res.status(500).end();
        return;
      }

      var requestArchivedRef = firebase
        .firestore()
        .collection(Constants.CARRIERS_RECORDS)
        .doc(carrierId)
        .collection(Constants.ORDERS)
        .where("orderStatus", "==", loadStatus.ARCHIVED )


        var requestCancelledRef = firebase
        .firestore()
        .collection(Constants.CARRIERS_RECORDS)
        .doc(carrierId)
        .collection(Constants.ORDERS)
        .where("orderStatus", "==", loadStatus.CANCELLED)
      let downloadedOrdersFromFS = [];
      let filteredArrayByDriver = [];

      try {
        const requestArchivedData = await requestArchivedRef.get();
        const requestCancelledData = await requestCancelledRef.get()

        requestArchivedData.forEach(function (doc) {
          let nextOrder = {
            id: doc.id,
            data: doc.data(),
          };
          downloadedOrdersFromFS.push(nextOrder);
        });

        requestCancelledData.forEach(function (doc) {
          let nextOrder = {
            id: doc.id,
            data: doc.data(),
          };
          downloadedOrdersFromFS.push(nextOrder);
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

      res.status(200).send(downloadedOrdersFromFS);
      return resolve();
    });
  }
};
