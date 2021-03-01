import firebase from "../../../firebase/firebase-adm";
import { Constants } from "../../../utils/constants";
import { loadStatus } from "../../../utils/status";
import {Responds} from "../../../utils/responds"

export default async (req, res) => {
  console.log("In Edit Order")
  const {
    orderId,
    userId,
    token,
    shipperOrderId,
    carrierId,
    carrierOrderId,
    orderInstructions,
    businessNameOnPickup,
    addressOnPickup,
    placeIdOnPickup,
    zipOnPickup,
    cityOnPickup,
    stateOnPickup,
    scheduledPickupDate,
    pickupNotes,
    contactNameOnPickup,
    emailOnPickup,
    phoneOnPickup,
    phonesOnPickup,
    faxOnPickup,
    businessNameOnDelivery,
    addressOnDelivery,
    placeIdOnDelivery,
    zipOnDelivery,
    cityOnDelivery,
    stateOnDelivery,
    scheduledDeliveryDate,
    deliveryNotes,
    contactNameOnDelivery,
    emailOnDelivery,
    phoneOnDelivery,
    phonesOnDelivery,
    faxOnDelivery,
    vin,
    year,
    make,
    model,
    color,
    lotNumber,
    price,
    type,
    inoperable,
    totalVehicles,
    orderAmount,
    driverPay,
    brokerFee,
    paymentMethod,
    paymentTerms,
    paymentStartUpon,
    invoiceId,
    invoiceEmail,
    invoiceNotes,
    businessNameOfShipper,
    addressOfShipper,
    placeIdOfShipper,
    cityOfShipper,
    stateOfShipper,
    zipOfShipper,
    contactNameOfShipper,
    emailOfShipper,
    phoneOfShipper,
    faxOfShipper,
  } = req.body;

  if (!carrierId || !userId || !token) {
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


  const createdAt = new Date();

  if (totalVehicles.length === 0) {
    const vehicle = {
      vin,
      year,
      make,
      model,
      color,
      lotNumber,
      price,
      type,
      inoperable,
    };
    totalVehicles.push(vehicle);
  }

  if ((totalVehicles.length !== 0 && year) || (totalVehicles.length !== 0 && make )  ) {
    const vehicle = {
      vin,
      year,
      make,
      model,
      color,
      lotNumber,
      price,
      type,
      inoperable,
    };
    totalVehicles.push(vehicle);
  }

  firebase
    .firestore()
    .collection(Constants.CARRIERS_RECORDS)
    .doc(carrierId)
    .collection(Constants.ORDERS)
    .doc(orderId)
    .update({

      carrierOrderId: carrierOrderId,
      shipperOrderId: shipperOrderId,
      // orderInstructions: generalData.orderInstructions,
      'pickup.pickupScheduledFirstDate': scheduledPickupDate,
      'pickup.pickupNotes': pickupNotes,
      'pickup.pickupAddress.address': addressOnPickup,
      'pickup.pickupAddress.city': cityOnPickup,
      'pickup.pickupAddress.state': stateOnPickup,
      'pickup.pickupAddress.zip': zipOnPickup,
      'pickup.pickupAddress.businessName': businessNameOnPickup,
      'pickup.pickupAddress.contactName': contactNameOnPickup,
      'pickup.pickupAddress.email': emailOnPickup,
      'pickup.pickupAddress.phone': phoneOnPickup,
      'pickup.pickupAddress.phones': phonesOnPickup,
      'pickup.pickupAddress.fax': faxOnPickup,

      'delivery.deliveryScheduledFirstDate': scheduledDeliveryDate,
      'delivery.deliveryNotes': deliveryNotes,
      'delivery.deliveryAddress.address': addressOnDelivery,
      'delivery.deliveryAddress.city': cityOnDelivery,
      'delivery.deliveryAddress.state': stateOnDelivery,
      'delivery.deliveryAddress.zip': zipOnDelivery,
      'delivery.deliveryAddress.businessName': businessNameOnDelivery,
      'delivery.deliveryAddress.contactName': contactNameOnDelivery,
      'delivery.deliveryAddress.email': emailOnDelivery,
      'delivery.deliveryAddress.phone': phoneOnDelivery,
      'delivery.deliveryAddress.phones': phonesOnDelivery,
      'delivery.deliveryAddress.fax': faxOnDelivery,

      'shipper.businessName': businessNameOfShipper,
      'shipper.address': addressOfShipper,
      'shipper.city': cityOfShipper,
      'shipper.state': stateOfShipper,
      'shipper.zip': zipOfShipper,
      'shipper.contactName': contactNameOfShipper,
      'shipper.email': emailOfShipper,
      'shipper.phone': phoneOfShipper,
      'shipper.fax': faxOfShipper,
    
      'orderPayment.orderAmount': orderAmount,
      'orderPayment.driverPay': driverPay,
      'orderPayment.brokerFee': brokerFee,
      'orderPayment.paymentUpon': paymentStartUpon,
      'orderPayment.paymentMethod': paymentMethod,
      'orderPayment.paymentTerms': paymentTerms,

      'orderInvoice.carrierInvoiceId': invoiceId,
      'orderInvoice.invoiceRecipientEmail': invoiceEmail,
      'orderInvoice.invoiceNotes': invoiceNotes,



      vehiclesArray: totalVehicles,
    });

  res.status(200).json({ status: Responds.ORDER_UPDATED });
};
