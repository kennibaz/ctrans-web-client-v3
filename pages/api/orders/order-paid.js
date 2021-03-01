import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { loadStatus } from "../../../utils/status";
import {Responds} from "../../../utils/responds"

export default async (req, res) => {
  const {
    carrierId,
    orderId,
  } = req.body;

  if(!carrierId|| !orderId){
    res.status(405).end()
    return;
  }
  

  firebase.firestore().collection(Constants.CARRIERS_RECORDS)
  .doc(carrierId)
  .collection(Constants.ORDERS)
  .doc(orderId)
  .update({
    orderStatus: loadStatus.PAID,
  });

  res.status(200).json({ status: Responds.ORDER_PAID });
};
