import firebase from "../../../firebase/firebase-adm";

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

    const userRef = firebase.firestore().collection("users").doc(userId);
    const userData = await userRef.get(); //get query
    const userDoc = userData.data();
    const userStatus = userDoc.active; // get current status
    const newUserStatus = !userStatus;
    await userRef.update({ active: newUserStatus });

    if (newUserStatus === false) {
      const curretLoadstoUnassignRef = firebase
        .firestore()
        .collection("carriers-records")
        .doc(carrierId)
        .collection("orders")
        .where("roles.driver_system_id", "==", userId);

      const curretLoadstoUnassign = await curretLoadstoUnassignRef.get();
      if (curretLoadstoUnassign.empty) {
        console.log("No matching documents.");
        return;
      }
      curretLoadstoUnassign.forEach((doc) => {
        ordersToUnassign.push(doc.id);
      });

      ordersToUnassign.forEach(async (order) => {
        const orderToUnassignRef = firebase
          .firestore()
          .collection("carriers-records")
          .doc(carrierId)
          .collection("orders")
          .doc(order);
        const orderToUnassign = await orderToUnassignRef.update({
          "roles.driver_system_id": "",
          order_status: "New",
        });
      });
    }
    res.status(200).send({st: "ok"});
    return resolve();
  });
};
