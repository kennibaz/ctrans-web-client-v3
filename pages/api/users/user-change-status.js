import firebase from "../../../firebase/firebase-adm";
import { loadStatus  } from "../../../utils/status"
import {Constants} from "../../../utils/constants"
import { Responds } from "../../../utils/responds";

export default async (req, res) => {
  return new Promise(async (resolve) => {
    const { userId, carrierId, token } = req.body;

    if(!userId || !carrierId || !token) {
        res.status(405).end();
        return
    }

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

    let ordersToUnassign = [];

    const userRef = firebase.firestore().collection(Constants.USERS).doc(userId);
    const userData = await userRef.get(); //get query
    const userDoc = userData.data();
    const userStatus = userDoc.active; // get current status
    const newUserStatus = !userStatus;
    await userRef.update({ active: newUserStatus });

    if (newUserStatus === false) {
      const currentLoadstoUnassignRef = firebase
        .firestore()
        .collection(Constants.CARRIERS_RECORDS)
        .doc(carrierId)
        .collection(Constants.ORDERS)
        .where("roles.driverId", "==", userId);

      const currentLoadstoUnassign = await currentLoadstoUnassignRef.get();
      if (currentLoadstoUnassign.empty) {
        console.log("No matching documents.");
        return;
      }
      currentLoadstoUnassign.forEach((doc) => {
        ordersToUnassign.push(doc.id);
      });

      ordersToUnassign.forEach(async (order) => {
        const orderToUnassignRef = firebase
          .firestore()
          .collection(Constants.CARRIERS_RECORDS)
          .doc(carrierId)
          .collection(Constants.ORDERS)
          .doc(order);

        await orderToUnassignRef.update({
          "roles.driverId": "",
          orderStatus: loadStatus.NEW,
        });
      });
    }
    res.status(200).send({st: Responds.USER_STATUS_CHANGED});
    return resolve();
  });
};
