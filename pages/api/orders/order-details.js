import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  if (req.method === "POST") {
    const { orderId, carrierId } = req.body;

    if (orderId) {
      var orderRef = firebase
        .firestore()
        .collection("carriers-records")
        .doc("1840b8a5-3381-41f7-9838-8ad23a7b50bd")
        .collection("orders")
        .doc(orderId);

      orderRef
        .get()
        .then(function (querySnapshot) {
          let id = querySnapshot.id;
          let data = querySnapshot.data()
          let respond = {id, data}
          res.json(respond);
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  }
};
