import firebase from "../../../firebase/firebase-adm";
import uuid from "react-uuid";

export default async (req, res) => {
  const {
    shipperOrderId,
    carrierId,
    token,
    userId,
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

  const vehicleId = uuid();

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

  const createdAt = firebase.firestore.Timestamp.now();

  if (
    (totalVehicles.length !== 0 && year) ||
    (totalVehicles.length !== 0 && make)
  ) {
    const vehicle = {
      vehicleId,
      vin,
      year,
      make,
      model,
      color,
      lotNumber,
      price,
      type,
      inoperable,
      pickupConditionsPhotos: [],
      // pickupBol,
      deliveryConditionsPhotos: [],
      // deliveryBol,
    };
    totalVehicles.push(vehicle);
  }

  if (totalVehicles.length === 0) {
    const vehicle = {
      vehicleId,
      vin,
      year,
      make,
      model,
      color,
      lotNumber,
      price,
      type,
      inoperable,
      pickupConditionsPhotos: [],
      // pickupBol,
      deliveryConditionsPhotos: [],
      // deliveryBol,
    };
    totalVehicles.push(vehicle);
  }

  if (phoneOnPickup) {
    phonesOnPickup.push(phoneOnPickup);
  }

  if (phoneOnDelivery) {
    phonesOnDelivery.push(phoneOnDelivery);
  }

  firebase
    .firestore()
    .collection("carriers-records")
    .doc(carrierId)
    .collection("orders")
    .add({
      createdAt,
      orderStatus: "New",
      carrierId: carrierId,
      //   order_mileage: distanceData.data.distance || "",
      //   order_price_per_mile: distanceData.data.pricePerMile || "",
      carrierOrderId: carrierOrderId,
      shipperOrderId: shipperOrderId,
      orderInstructions: orderInstructions,
      roles: {
        driverId: "",
        dispatcherId: "",
        agentId: "",
        supervisorId: "",
      },
      usersNames: {
        driverName: "",
        dispatcherName: "",
      },
      pickup: {
        pickupScheduledFirstDate: scheduledPickupDate,
        pickupNotes: pickupNotes,
        pickupAddress: {
          address: addressOnPickup,
          placeId: placeIdOnPickup,
          city: cityOnPickup,
          state: stateOnPickup,
          zip: zipOnPickup,
          businessName: businessNameOnPickup,
          contactName: contactNameOnPickup,
          email: emailOnPickup,
          phone: phoneOnPickup,
          fax: faxOnPickup,
          phones: phonesOnPickup,
        },
        //   pickup_coordinates: {
        //     lat: distanceData.data.pickup_coordinates.lat,
        //     lng: distanceData.data.pickup_coordinates.lng,
        //   },
      },
      delivery: {
        deliveryScheduledFirstDate: scheduledDeliveryDate,
        deliveryNotes: deliveryNotes,
        deliveryAddress: {
          address: addressOnDelivery,
          placeId: placeIdOnDelivery,
          city: cityOnDelivery,
          state: stateOnDelivery,
          zip: zipOnDelivery,
          businessName: businessNameOnDelivery,
          contactName: contactNameOnDelivery,
          email: emailOnDelivery,
          phone: phoneOnDelivery,
          fax: faxOnDelivery,
          phones: phonesOnDelivery,
        },
        //   delivery_coordinates: {
        //     lat: distanceData.data.delivery_coordinates.lat,
        //     lng: distanceData.data.delivery_coordinates.lng,
        //   },
      },

      shipper: {
        businessName: businessNameOfShipper,
        placeId: placeIdOfShipper,
        address: addressOfShipper,
        city: cityOfShipper,
        state: stateOfShipper,
        zip: zipOfShipper,
        contactName: contactNameOfShipper,
        email: emailOfShipper,
        phone: phoneOfShipper,
        fax: faxOfShipper,
      },

      orderPayment: {
        orderAmount: orderAmount,
        driverPay: driverPay,
        brokerFee: brokerFee,
        paymentUpon: paymentStartUpon,
        paymentMethod: paymentMethod,
        paymentTerms: paymentTerms,
      },

      orderInvoice: {
        carrierInvoiceId: invoiceId,
        invoiceRecipientEmail: invoiceEmail,
        invoiceNotes: invoiceNotes,
      },

      orderActivity: [
        {
          activityDate: createdAt,
          activityStatus: "Created",
          activityUser: "dispatcher",
        },
      ],
      tripId: "",

      vehiclesArray: totalVehicles,
    });

  res.status(200).json({ status: "order cancelled" });
};
