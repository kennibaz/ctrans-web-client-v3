import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  var driverRef = firebase.firestore().collection("users");
  let new_array = [];

  driverRef
    .where("carrierId", "==", "1840b8a5-3381-41f7-9838-8ad23a7b50bd")
    .where("role", "==", "driver")
    .where("active", "==", true)
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
    });
};
