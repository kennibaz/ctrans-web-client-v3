import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";


export default async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.method === "POST") {
      const { orderId, carrierId, token, userId } = req.body;
      if (  !userId || !token) {
        res.status(405).end();
        return;
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

      let id, data;

      if (orderId) {
        var orderRef = firebase
          .firestore()
          .collection(Constants.CARRIERS_RECORDS)
          .doc(carrierId)
          .collection(Constants.ORDERS)
          .doc(orderId);

        try {
          const orderData = await orderRef.get();
          id = orderData.id;
          data = orderData.data();
        } catch (error) {
          console.log(error); // Can be a simple console.error too
          res.status(500).end();
          return resolve();
        }
        res.status(200).send({ id, data });
        return resolve();
      }
    }
  });
};
