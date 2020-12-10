import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  return new Promise( async(resolve) => {
    const {carrierId} = req.body
    if(!carrierId){
      res.status(500).end()
      return
    }
    var driverRef = firebase
      .firestore()
      .collection("users")
      .where("carrierId", "==", carrierId)
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

  