import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { Roles } from "../../../utils/roles";

export default async (req, res) => {
  return new Promise( async(resolve) => {
    const {carrierId} = req.body
    if(!carrierId){
      res.status(500).end()
      return
    }
    var driverRef = firebase
      .firestore()
      .collection(Constants.USERS)
      .where("carrierId", "==", carrierId)
      .where("role", "==", Roles.DRIVER)
      .where("active", "==", true);
    let respondData = [];

    try {
    const driverData = await driverRef.get()
    driverData.forEach(function (doc) {
      let nextDriver = {
        id: doc.id,
        data: doc.data(),
      };
      respondData.push(nextDriver);
    });
    } catch (error) {
      console.log(error); // Can be a simple console.error too
      res.status(500).end();
      return resolve();
    }
      res.status(200).send(respondData);
      return resolve();

  });
};

  