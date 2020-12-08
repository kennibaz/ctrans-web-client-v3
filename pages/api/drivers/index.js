import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  return new Promise( async(resolve) => {
    var driverRef = firebase
      .firestore()
      .collection("users")
      .where("carrierId", "==", "1840b8a5-3381-41f7-9838-8ad23a7b50bd")
      .where("role", "==", "driver")
      .where("active", "==", true);
    let new_array = [];

    try {
    const driverData = await driverRef.get()
    driverData.forEach(function (doc) {
      let new_obj = {
        id: doc.id,
        data: doc.data(),
      };
      new_array.push(new_obj);
    });
    } catch (error) {
      console.log(error); // Can be a simple console.error too
      res.status(500).end();
      return resolve();
    }
      res.status(200).send(new_array);
      return resolve();

  });
};

  