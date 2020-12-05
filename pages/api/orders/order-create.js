import firebase from "../../../firebase/firebase-adm";

export default async (req, res) => {
  const {
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
    .add({
      created_at,
      order_status: "New",
      carrierId: carrierId,
    //   order_mileage: distanceData.data.distance || "",
    //   order_price_per_mile: distanceData.data.pricePerMile || "",
      order_carrier_inner_id: carrierOrderId,
      order_shipper_inner_id: shipperOrderId,
      // order_instructions: generalData.orderInstructions,
      roles: {
        driver_system_id: "",
        dispatcher_system_id: "",
        agent_system_id: "",
        supervisor_system_id: "",
      },
      users_names: {
        driver_name: "",
        dispatcher_name: "",
      },
      pickup: {
        pickup_scheduled_first_date: scheduledPickupDate,
        pickup_additional_notes: pickupNotes,
        pickup_address: {
          address: addressOnPickup,
          placeId: placeIdOnPickup,
          city: cityOnPickup,
          state: stateOnPickup,
          zip: zipOnPickup,
          business_name: businessNameOnPickup,
          contact_name: contactNameOnPickup,
          email: emailOnPickup,
          phone: phoneOnPickup,
          fax: faxOnPickup,
        },
        //   pickup_coordinates: {
        //     lat: distanceData.data.pickup_coordinates.lat,
        //     lng: distanceData.data.pickup_coordinates.lng,
        //   },
      },
      delivery: {
        delivery_scheduled_first_date: scheduledDeliveryDate,
        delivery_additional_notes: deliveryNotes,
        delivery_address: {
          address: addressOnDelivery,
          placeId: placeIdOnDelivery,
          city: cityOnDelivery,
          state: stateOnDelivery,
          zip: zipOnDelivery,
          business_name: businessNameOnDelivery,
          contact_name: contactNameOnDelivery,
          email: emailOnDelivery,
          phone: phoneOnDelivery,
          fax: faxOnDelivery,
        },
        //   delivery_coordinates: {
        //     lat: distanceData.data.delivery_coordinates.lat,
        //     lng: distanceData.data.delivery_coordinates.lng,
        //   },
      },

      shipper: {
        business_name: businessNameOfShipper,
        placeId: placeIdOfShipper,
        address: addressOfShipper,
        city: cityOfShipper,
        state: stateOfShipper,
        zip: zipOfShipper,
        contact_name: contactNameOfShipper,
        email: emailOfShipper,
        phone: phoneOfShipper,
        fax: faxOfShipper,
      },

      order_payment: {
        order_total_amount: orderAmount,
        driver_pay: driverPay,
        broker_fee: brokerFee,
        payment_upon: paymentStartUpon,
        payment_method: paymentMethod,
        payment_terms: paymentTerms,
      },

      order_invoice: {
        invoice_carrier_id: invoiceId,
        invoice_recipient_email: invoiceEmail,
        invoice_notes: invoiceNotes,
      },

      order_activity: [
        {
          activity_date: created_at,
          activity_type: "order_created",
          activity_user: "dispatcher",
          activity_log: `Order "${shipperOrderId}" created at ${created_at}`,
        },
      ],
      tripId: "",

      vehiclesArray: totalVehicles,
    });

  res.status(200).json({ status: "order cancelled" });
};
