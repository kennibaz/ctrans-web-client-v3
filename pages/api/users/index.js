import firebase from "../../../firebase/firebase-adm";
import { Roles } from "../../../utils/roles"
import {Constants} from "../../../utils/constants"

export default async (req, res) => {
  return new Promise(async (resolve) => {
    const {
      carrierId,
      showAll,
      showDrivers,
      showDispatchers,
      token,
      userId,
    } = req.body;


    if (!token || !userId || !carrierId) {
      res.status(405).end();
      return;
    }

    let requestArray = [];

    showDrivers && requestArray.push(Roles.DRIVER);
    showDispatchers && requestArray.push(Roles.DISPATCHER);

    showAll && requestArray.push(Roles.DRIVER, Roles.DISPATCHER);

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

    var userRef = firebase
        .firestore()
        .collection(Constants.USERS)
        .where("carrierId", "==", carrierId);

        let new_array = [];
        let filtered_array = [];


        try {
            const userData = await userRef.get();
            userData.forEach(function (doc) {
              let new_obj = {
                id: doc.id,
                data: doc.data(),
              };
              new_array.push(new_obj);
            });
            requestArray.forEach((role) => {
              new_array.forEach((user) => {
                if (user.data.role === role) {
                  filtered_array.push(user);
                }
              });
            });
      
          } catch (error) {
            console.log(error); // Can be a simple console.error too
            res.status(500).end();
            return resolve();
          }

          res.status(200).send(filtered_array);
          return resolve();
  });
};
