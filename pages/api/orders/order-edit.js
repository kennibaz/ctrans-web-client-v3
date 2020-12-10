import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
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


  const created_at = new Date();

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
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .doc(orderId)
    .update({

      order_carrier_inner_id: carrierOrderId,
      order_shipper_inner_id: shipperOrderId,
      // order_instructions: generalData.orderInstructions,
      'pickup.pickup_scheduled_first_date': scheduledPickupDate,
      'pickup.pickup_additional_notes': pickupNotes,
      'pickup.pickup_address.address': addressOnPickup,
      'pickup.pickup_address.city': cityOnPickup,
      'pickup.pickup_address.state': stateOnPickup,
      'pickup.pickup_address.zip': zipOnPickup,
      'pickup.pickup_address.business_name': businessNameOnPickup,
      'pickup.pickup_address.contact_name': contactNameOnPickup,
      'pickup.pickup_address.email': emailOnPickup,
      'pickup.pickup_address.phone': phoneOnPickup,
      'pickup.pickup_address.phones': phonesOnPickup,
      'pickup.pickup_address.fax': faxOnPickup,

      'delivery.delivery_scheduled_first_date': scheduledDeliveryDate,
      'delivery.delivery_additional_notes': deliveryNotes,
      'delivery.delivery_address.address': addressOnDelivery,
      'delivery.delivery_address.city': cityOnDelivery,
      'delivery.delivery_address.state': stateOnDelivery,
      'delivery.delivery_address.zip': zipOnDelivery,
      'delivery.delivery_address.business_name': businessNameOnDelivery,
      'delivery.delivery_address.contact_name': contactNameOnDelivery,
      'delivery.delivery_address.email': emailOnDelivery,
      'delivery.delivery_address.phone': phoneOnDelivery,
      'delivery.delivery_address.phones': phonesOnDelivery,
      'delivery.delivery_address.fax': faxOnDelivery,

      'shipper.business_name': businessNameOfShipper,
      'shipper.address': addressOfShipper,
      'shipper.city': cityOfShipper,
      'shipper.state': stateOfShipper,
      'shipper.zip': zipOfShipper,
      'shipper.contact_name': contactNameOfShipper,
      'shipper.email': emailOfShipper,
      'shipper.phone': phoneOfShipper,
      'shipper.fax': faxOfShipper,
    
      'order_payment.order_total_amount': orderAmount,
      'order_payment.driver_pay': driverPay,
      'order_payment.broker_fee': brokerFee,
      'order_payment.payment_upon': paymentStartUpon,
      'order_payment.payment_method': paymentMethod,
      'order_payment.payment_terms': paymentTerms,

      'order_invoice.invoice_carrier_id': invoiceId,
      'order_invoice.invoice_recipient_email': invoiceEmail,
      'order_invoice.invoice_notes': invoiceNotes,



      vehiclesArray: totalVehicles,
    });

  res.status(200).json({ status: "order updated" });
};
