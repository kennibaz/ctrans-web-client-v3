import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.method === "POST") {
      const { orderId, carrierId } = req.body;
      let id, data;

      if (orderId) {
        var orderRef = firebase
          .firestore()
          .collection("carriers-records")
          .doc("1840b8a5-3381-41f7-9838-8ad23a7b50bd")
          .collection("orders")
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
