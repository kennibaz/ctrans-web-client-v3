/*
TODO
save when vehicle data was uploaded into array
*/




import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import uuid from "react-uuid";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import Collapse from "@material-ui/core/Collapse";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Container } from "@material-ui/core";
import Dropzone from 'react-dropzone'
import { withAuth } from "../../utils/withAuth";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Tooltip from '@material-ui/core/Tooltip';

import EditPhoneDialog from "../../components/order/dialogs/EditPhonesDialog";
import EditPhoneDialogDelivery from "../../components/order/dialogs/EditPhonesDialogDelivery";
import AutoCompleteAddress from "../../components/order/AutoCompleteAddress";
import { makes } from "../../src/makes";

import { PaymentMethods, CarTypes, PaymentStartUpon, PaymentTerms } from "../../utils/constants"
import axios from "axios";


const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginTop: 0,
    border: 2,
  },
  upperToolBar: {
    color: "black",
    background: "white",
  },
  tabBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginTop: 200,
  },
  inputField: {
    fontSize: 12,
  },
  inputText: {
    fontSize: 12,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
  },
  button: {
    fontSize: 11,
  },
  margin: {
    right: 5,
    top: "50%",
  },
  tableCell: {
    fontSize: 13,
  },
  vehicleInput: {
    fontSize: 13,
  },
  select: {
    paddingBottom: 8,
  },
  checkBoxLabel: {
    fontSize: 15,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    top: "50%",
    right: -18,
    background: "#432c7d",
    color: "#d7d5da",
    // The border color match the background color.
  },
}))(Badge);

function createOrder(props) {
  const vehicleId = uuid();
  const classes = useStyles();
  const router = useRouter();

  const [uploadedSpinner, setUploadSpinner] = useState(false)

  const [isEditPhonesOnPickupOpen, setIsEditPhonesOnPickupOpen] = useState(
    false
  );
  const [isEditPhonesOnDeliveryOpen, setIsEditPhonesOnDeliveryOpen] = useState(
    false
  );
  const [shipperOrderId, setShipperOrderId] = useState("");
  const [carrierOrderId, setCarrierOrderId] = useState("");
  const [orderInstructions, setOrderInstructions] = useState("");
  //Origin
  const [businessNameOnPickup, setBusinessNameOnPickup] = useState("");
  const [addressOnPickup, setAddressOnPickup] = useState("");
  const [placeIdOnPickup, setPlaceIdOnPickup] = useState("");
  const [zipOnPickup, setZipOnPickup] = useState("");
  const [cityOnPickup, setCityOnPickup] = useState("");
  const [stateOnPickup, setStateOnPickup] = useState("");
  const [scheduledPickupDate, setScheduledPickupDate] = useState("");

  const [pickupNotes, setPickupNotes] = useState("");
  const [contactNameOnPickup, setContactNameOnPickup] = useState("");
  const [emailOnPickup, setEmailOnPickup] = useState("");
  const [phoneOnPickup, setPhoneOnPickup] = useState("");
  const [phonesOnPickup, setPhonesOnPickup] = useState([]);
  const [faxOnPickup, setFaxOnPickup] = useState("");
  //Destination
  const [businessNameOnDelivery, setBusinessNameOnDelivery] = useState("");
  const [addressOnDelivery, setAddressOnDelivery] = useState("");
  const [placeIdOnDelivery, setPlaceIdOnDelivery] = useState("");
  const [zipOnDelivery, setZipOnDelivery] = useState("");
  const [cityOnDelivery, setCityOnDelivery] = useState("");
  const [stateOnDelivery, setStateOnDelivery] = useState("");
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [contactNameOnDelivery, setContactNameOnDelivery] = useState("");
  const [emailOnDelivery, setEmailOnDelivery] = useState("");
  const [phoneOnDelivery, setPhoneOnDelivery] = useState("");
  const [phonesOnDelivery, setPhonesOnDelivery] = useState([]);
  const [faxOnDelivery, setFaxOnDelivery] = useState("");
  //Vehicles
  const [vin, setVin] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [inoperable, setInoperable] = useState(false);
  const [totalVehicles, setTotalVehicles] = useState([]);
  const [isEditVehicleMode, setIsEditVehicleMode] = useState(false);
  const [updateButtonShow, setUpdateButtonShow] = useState(false); //state for update button
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(""); //state for storing selected row index to update it in parent component
  const [modelsArray, setModelsArray] = useState(["model"]); //state for storing selected row index to update it in parent component

  //payment
  const [orderAmount, setOrderAmount] = useState("");
  const [driverPay, setDriverPay] = useState("");
  const [brokerFee, setBrokerFee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [paymentStartUpon, setPaymentStartUpon] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceEmail, setInvoiceEmail] = useState("");
  const [invoiceNotes, setInvoiceNotes] = useState("");

  //shipper
  const [businessNameOfShipper, setBusinessNameOfShipper] = useState("");
  const [addressOfShipper, setAddressOfShipper] = useState("");
  const [placeIdOfShipper, setPlaceIdOfShipper] = useState("");
  const [cityOfShipper, setCityOfShipper] = useState("");
  const [stateOfShipper, setStateOfShipper] = useState("");
  const [zipOfShipper, setZipOfShipper] = useState("");
  const [contactNameOfShipper, setContactNameOfShipper] = useState("");
  const [emailOfShipper, setEmailOfShipper] = useState("");
  const [phoneOfShipper, setPhoneOfShipper] = useState("");
  const [faxOfShipper, setFaxOfShipper] = useState("");

  //Validation
  const [isScheduledPickupDateValid, setIsScheduledPickupDateValid] = useState(
    true
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [isShipperOrderValid, setIsShipperOrderValid] = useState(true);
  const [
    isBusinessNameOfShipperValid,
    setIsBusinessNameOfShipperValid,
  ] = useState(true);
  const [isPhoneOfShipperValid, setIsPhoneOfShipperValid] = useState(true);
  const [isAddressZipOnPickupValid, setIsAddressZipOnPickupValid] = useState(
    true
  );
  const [
    isAddressZipOnDeliveryValid,
    setIsAddressZipOnDeliveryValid,
  ] = useState(true);

  const [
    isScheduledDeliveryDateValid,
    setIsScheduledDeliveryDateValid,
  ] = useState(true);
  const [isPhoneOnPickupValid, setIsPhoneOnPickupValid] = useState(true);
  const [isPhoneOnDeliveryValid, setIsPhoneOnDeliveryValid] = useState(true);
  const [isYearValid, setIsYearValid] = useState(true);
  const [isMakeValid, setIsMakeValid] = useState(true);
  const [isModelValid, setIsModelValid] = useState(true);
  const [isOrderAmountValid, setIsOrderAmountValid] = useState(true);
  const [isPaymentMethodValid, setIsPaymentMethodValid] = useState(true);
  const [isPaymentStartUponValid, setIsPaymentStartUponValid] = useState(true);
  const [isPaymentTermsValid, setIsPaymentTermsValid] = useState(true);

  //TBD for addresses
  const [shipperAddressTBD, setShipperAddressTBD] = useState(false);
  const [originAddressTBD, setOriginAddressTBD] = useState(false);
  const [destinationAddressTBD, setDestinationAddressTBD] = useState(false);

  //USEEFFECTS

  //Models array setter
  // useEffect(() => {
  //   async function result() {
  //     const result = await axios.post("/api/vehicles/get-models-by-make", {
  //       make: make,
  //     });
  //     setModelsArray(result.data);
  //   }
  //   result();
  // }, [make]);

  const setMakeModelHandler = async (make) => {
    setMake(make);
    const result = await axios.post("/api/vehicles/get-models-by-make", {
      make: make,
    });
    setModelsArray(result.data);
  };

  const uploadFileParser = async (document) => {
    setUploadSpinner(true)
    const result = await axios.post("/api/parser/dispatchSheetParser", {document: Buffer.from(document)});
    setUploadSpinner(false)
    let parsedData = result.data;
    setShipperOrderId(parsedData.shipperOrderId);
    setBusinessNameOfShipper(parsedData.shipperName);
    setPhoneOfShipper(parsedData.shipperPhone);
    setAddressOfShipper(parsedData.shipperAddress);
    setCityOfShipper(parsedData.shipperCity)
    setStateOfShipper(parsedData.shipperState)
    setZipOfShipper(parsedData.shipperZip)
    setContactNameOfShipper(parsedData.shipperContactName);

    setPhoneOnPickup(parsedData.pickupPhone);
    setAddressOnPickup(parsedData.pickupAddress);
    setCityOnPickup(parsedData.pickupCity)
    setStateOnPickup(parsedData.pickupState)
    setZipOnPickup(parsedData.pickupZip)
    setContactNameOnPickup(parsedData.pickupContactName);
    setBusinessNameOnPickup(parsedData.pickupBusinessName)

    setPhoneOnDelivery(parsedData.deliveryPhone);
    setAddressOnDelivery(parsedData.deliveryAddress);
    setCityOnDelivery(parsedData.deliveryCity)
    setStateOnDelivery(parsedData.deliveryState)
    setZipOnDelivery(parsedData.deliveryZip)
    setContactNameOnDelivery(parsedData.deliveryContactName);
    setBusinessNameOnDelivery(parsedData.deliveryBusinessName)

    setOrderAmount(parsedData.orderAmount);
    setPaymentTerms(parsedData.paymentTerms);

    setPaymentMethod(parsedData.paymentMethod)
    setPaymentStartUpon(parsedData.paymentStartUpon)

    setTotalVehicles(parsedData.vehiclesArray)

    setOrderInstructions(parsedData.orderInstructions)

    setScheduledPickupDate(parsedData.pickupDate)
    setScheduledDeliveryDate(parsedData.deliveryDate)
    parsedData.pickupMultiplePhones && setPhonesOnPickup(parsedData.pickupMultiplePhones)
    parsedData.deliveryMultiplePhones && setPhonesOnDelivery(parsedData.deliveryMultiplePhones)
    parsedData.brokerFee && setBrokerFee(parsedData.brokerFee)

    parsedData.buyerNumber && setPickupNotes(`Buyer Number ${parsedData.buyerNumber}`)

    if (parsedData.isPickupZipError) {
      alert("Pickup address was not recognized. Please enter manually")
      setIsAddressZipOnPickupValid(false)
    }
    if (parsedData.isDeliveryZipError) {
      alert("Delivery address was not recognized. Please enter manually")
      setIsAddressZipOnDeliveryValid(false)
    }
    

  };

  // const uploadedFilesHandler = (files) => {
  //   setUploadedFiles(files)
  //   const reader = new FileReader()

  //   reader.onabort = () => console.log('file reading was aborted')
  //   reader.onerror = () => console.log('file reading has failed')
  //   reader.onload = () => {
  //   // Do whatever you want with the file contents
  //     const binaryStr = reader.result
  //     console.log(binaryStr)
  //   }
  //   reader.readAsArrayBuffer(files)

  // }




  // add vehicle to array
  const addVehicleHandler = () => {
    let currentVehiclesArray = [...totalVehicles];
    let newVehicle = {
      vehicleId: vehicleId,
      vin: vin,
      year: year,
      make: make,
      model: model,
      color: color,
      inoperable: inoperable,
      lot_number: lotNumber,
      type: type,
      pickupConditionsPhotos: [],
      pickupBol: "",
      deliveryConditionsPhotos: [],
      deliveryBol: "",
    };
    currentVehiclesArray.push(newVehicle);
    setTotalVehicles(currentVehiclesArray);
    setVin("");
    setYear("");
    setMake("");
    setModel("");
    setColor("");
    setLotNumber("");
    setPrice("");
    setType("");
    setInoperable("");
  };
  //remove vehicle from array

  const removeVehicleHandler = (index) => {
    let currentVehiclesArray = [...totalVehicles];
    currentVehiclesArray.splice(index, 1);
    setTotalVehicles(currentVehiclesArray);
  };

  //prepare to edit vehicles
  const editVehicleHandler = (index) => {
    setSelectedVehicleIndex(index);
    setIsEditVehicleMode(true);
    let currentVehiclesArray = [...totalVehicles];
    let currentEditVehicle = currentVehiclesArray[index];
    setVin(currentEditVehicle.vin);
    setYear(currentEditVehicle.year);
    setMake(currentEditVehicle.make);
    setModel(currentEditVehicle.model);
    setLotNumber(currentEditVehicle.lotNumber);
    setType(currentEditVehicle.type);
    setInoperable(currentEditVehicle.inoperable);
    setUpdateButtonShow(!updateButtonShow);
  };
  //update button handler
  const updateButtonHandler = () => {
    updateVehicleHandler(selectedVehicleIndex);
    setUpdateButtonShow(!updateButtonShow);
  };
  //cancel buttom handler
  const cancelButtonHandler = () => {
    setVin("");
    setYear("");
    setMake("");
    setModel("");
    setColor("");
    setLotNumber("");
    setPrice("");
    setType("");
    setInoperable("");
    setIsEditVehicleMode(false);
    setUpdateButtonShow(!updateButtonShow);
  };

  //save updated vehicle
  const updateVehicleHandler = (index) => {
    let currentVehiclesArray = [...totalVehicles];
    let updatedVehicle = {
      vin: vin,
      year: year,
      make: make,
      model: model,
      color: color,
      inoperable: inoperable,
      lot_number: lotNumber,
      price: price,
      type: type,
    };
    currentVehiclesArray.splice(index, 1, updatedVehicle);
    setTotalVehicles(currentVehiclesArray);
    setVin("");
    setYear("");
    setMake("");
    setModel("");
    setColor("");
    setLotNumber("");
    setPrice("");
    setType("");
    setInoperable("");
    setIsEditVehicleMode(false);
  };

  //Phone dialogs handler
  const phoneAddPickupHandler = () => {
    let currentPhonesArray = [...phonesOnPickup];
    currentPhonesArray.push(phoneOnPickup);
    setPhonesOnPickup(currentPhonesArray);
    setPhoneOnPickup("");
  };

  const phoneAddDeliveryHandler = () => {
    let currentPhonesArray = [...phonesOnDelivery];
    currentPhonesArray.push(phoneOnDelivery);
    setPhonesOnDelivery(currentPhonesArray);
    setPhoneOnDelivery("");
  };
  //Phone dialogs handler
  const removePhonePickupHandler = (index) => {
    let currentPhonesArray = [...phonesOnPickup];
    currentPhonesArray.splice(index, 1);
    setPhonesOnPickup(currentPhonesArray);
  };

  const removePhoneDeliveryHandler = (index) => {
    let currentPhonesArray = [...phonesOnDelivery];
    currentPhonesArray.splice(index, 1);
    setPhonesOnDelivery(currentPhonesArray);
  };

  const autoCompleteHandlerPickup = async (addressDescription, place_id) => {
    if (originAddressTBD) {
      setAddressOnPickup("To Be Defined...");
      setPlaceIdOnPickup("");
    } else if (addressDescription) {
      setAddressOnPickup(addressDescription);
      setPlaceIdOnPickup(place_id);
      const respond = await axios.post("/api/geo/get-zip-by-place-id", {
        placeId: place_id,
      });
      setZipOnPickup(respond.data.zip);
      setCityOnPickup(respond.data.city);
      setStateOnPickup(respond.data.state);
    }
  };
  const autoCompleteHandlerDelivery = async (addressDescription, place_id) => {
    if (destinationAddressTBD) {
      setAddressOnDelivery("To Be Defined...");
      setPlaceIdOnDelivery("");
    } else if (addressDescription) {
      setAddressOnDelivery(addressDescription);
      setPlaceIdOnDelivery(place_id);
      const respond = await axios.post("/api/geo/get-zip-by-place-id", {
        placeId: place_id,
      });
      setZipOnDelivery(respond.data.zip);
      setCityOnDelivery(respond.data.city);
      setStateOnDelivery(respond.data.state);
    }
  };
  const autoCompleteHandlerShipper = async (addressDescription, place_id) => {
    if (shipperAddressTBD) {
      setAddressOfShipper("To Be Defined...");
      setPlaceIdOfShipper("");
    } else if (addressDescription) {
      setAddressOfShipper(addressDescription);
      setPlaceIdOfShipper(place_id);
      const respond = await axios.post("/api/geo/get-zip-by-place-id", {
        placeId: place_id,
      });
      setZipOfShipper(respond.data.zip);
      setCityOfShipper(respond.data.city);
      setStateOfShipper(respond.data.state);
    }
  };

  //Vin autocomplete handler
  const orderVehiclesVinAutoFillHandler = async (event) => {
    setVin(event.target.value);

    if (event.target.value.length === 17) {
      try {
        const vinData = await axios.post("/api/vehicles/get-vin", {
          vin: event.target.value,
        });

        setYear(vinData.data.ModelYear);
        setMake(vinData.data.Make);
        setModel(vinData.data.Model);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //save handler
  const saveOrderHandler = async () => {
    validateInputs();
    if (!isFormValid) {
      alert("Please enter all required fields");
      return;
    } else {
      await axios.post("/api/orders/order-create", {
        carrierId: props.carrierId,
        shipperOrderId,
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
        userId: props.userId,
        token: props.token,
      });
      router.push("/orders/");
    }
  };

  //validate inputs

  const validateLoadId = (e) => {
    if (!e) {
      setIsShipperOrderValid(false);
    } else {
      setIsShipperOrderValid(true);
    }
  };

  const validateShipperPhone = (e) => {
    if (!e) {
      setIsPhoneOfShipperValid(false);
    } else {
      setIsPhoneOfShipperValid(true);
    }
  };

  const validateShipperBusinessName = (e) => {
    if (!e) {
      setIsBusinessNameOfShipperValid(false);
    } else {
      setIsBusinessNameOfShipperValid(true);
    }
  };

  const validateOriginPhone = (e) => {
    if (!e) {
      setIsPhoneOnPickupValid(false);
    } else {
      setIsPhoneOnPickupValid(true);
    }
  };

  const validateOriginZip = (e) => {
    if (!e) {
      setIsAddressZipOnPickupValid(false);
    } else {
      setIsAddressZipOnPickupValid(true);
    }
  };

  const validateOriginDate = (e) => {
    if (!e) {
      setIsScheduledPickupDateValid(false);
    } else {
      setIsScheduledPickupDateValid(true);
    }
  };

  const validateDestinationPhone = (e) => {
    if (!e) {
      setIsPhoneOnDeliveryValid(false);
    } else {
      setIsPhoneOnDeliveryValid(true);
    }
  };

  const validateDestinationZip = (e) => {
    if (!e) {
      setIsAddressZipOnDeliveryValid(false);
    } else {
      setIsAddressZipOnDeliveryValid(true);
    }
  };

  const validateDestinationDate = (e) => {
    if (!e) {
      setIsScheduledDeliveryDateValid(false);
    } else {
      setIsScheduledDeliveryDateValid(true);
    }
  };

  const validateOrderAmount = (e) => {
    if (!e) {
      setIsOrderAmountValid(false);
    } else {
      setIsOrderAmountValid(true);
    }
  };

  const validatePaymentTerms = (e) => {
    if (!e) {
      setIsPaymentTermsValid(false);
    } else {
      setIsPaymentTermsValid(true);
    }
  };

  const validatePaymentStartDate = (e) => {
    if (!e) {
      setIsPaymentStartUponValid(false);
    } else {
      setIsPaymentStartUponValid(true);
    }
  };

  const validatePaymentMethod = (e) => {
    if (!e) {
      setIsPaymentMethodValid(false);
    } else {
      setIsPaymentMethodValid(true);
    }
  };

  const validateInputs = () => {
    if (
      (shipperOrderId,
      businessNameOfShipper,
      phoneOfShipper,
      year,
      make,
      model,
      phoneOnPickup,
      zipOnPickup,
      scheduledPickupDate,
      phonesOnDelivery,
      zipOnDelivery,
      scheduledDeliveryDate,
      orderAmount,
      paymentTerms,
      paymentMethod,
      paymentStartUpon)
    ) {
      setIsFormValid(true);
    } else {
      !shipperOrderId && setIsShipperOrderValid(false),
        !businessNameOfShipper && setIsBusinessNameOfShipperValid(false);
      !phoneOfShipper && setIsPhoneOfShipperValid(false);
      !year && setIsYearValid(false);
      !make && setIsMakeValid(false);
      !model && setIsModelValid(false);
      !phoneOnPickup && setIsPhoneOnPickupValid(false);
      !zipOnPickup && setIsAddressZipOnPickupValid(false);
      !scheduledPickupDate && setIsScheduledPickupDateValid(false);
      !phoneOnDelivery && setIsPhoneOnDeliveryValid(false);
      !zipOnDelivery && setIsAddressZipOnDeliveryValid(false);
      !scheduledDeliveryDate && setIsScheduledDeliveryDateValid(false);
      !orderAmount && setIsOrderAmountValid(false);
      !paymentTerms && setIsPaymentTermsValid(false);
      !paymentMethod && setIsPaymentMethodValid(false);
      !paymentStartUpon && setIsPaymentStartUponValid(false);
    }
    return;
  };

  // TBD functions

  const shipperAddressTBDHandler = () => {
    setShipperAddressTBD(!shipperAddressTBD);
  };

  const originAddressTBDHandler = () => {
    setOriginAddressTBD(!originAddressTBD);
  };

  const destinationAddressTBDHandler = () => {
    setDestinationAddressTBD(!destinationAddressTBD);
  };

  //Dialogs

  let editPhoneOnPickupDialog = (
    <EditPhoneDialog
      phones={phonesOnPickup}
      isOpen={isEditPhonesOnPickupOpen}
      removePhoneHandler={removePhonePickupHandler}
      setIsEditPhonesOnPickupOpen={setIsEditPhonesOnPickupOpen}
    />
  );

  let editPhoneOnDeliveryDialog = (
    <EditPhoneDialogDelivery
      phones={phonesOnDelivery}
      isOpen={isEditPhonesOnDeliveryOpen}
      removePhoneHandler={removePhoneDeliveryHandler}
      setIsEditPhonesOnDeliveryOpen={setIsEditPhonesOnDeliveryOpen}
    />
  );

  //content

  let GeneralTermsContent = (
    <Grid item xs={12}>
      <Paper elevation={0} variant="outlined">
        <Grid id="subrow_1" item container xs={12}>
          <Grid id="column_1" item container direction="row" xs={12}>
            <Grid item xs={3}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Shipper and Order
                </Box>
            
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box fontSize="h6.fontSize" m={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shipperAddressTBD}
                      onChange={() => {
                        shipperAddressTBDHandler();
                      }}
                      name="shipperAddressTBD"
                      color="primary"
                    />
                  }
                  label={
                    <span style={{ fontSize: 12 }}>
                      Define shipper address later
                    </span>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="shipper_id">Load ID</label>
                  <TextField
                    error={!isShipperOrderValid ? true : false}
                    placeholder={!isShipperOrderValid ? "Required" : null}
                    id="shipper_id"
                    required
                    value={shipperOrderId}
                    onChange={(e) => setShipperOrderId(e.target.value)}
                    onBlur={(e) => {
                      validateLoadId(e.target.value);
                    }}
                    margin="dense"
                    name="shipper_id"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="shipper_businessName">Shipper name</label>
                  <TextField
                    error={!isBusinessNameOfShipperValid ? true : false}
                    placeholder={
                      !isBusinessNameOfShipperValid ? "Required" : null
                    }
                    id="shipper_businessName"
                    required
                    value={businessNameOfShipper}
                    onChange={(e) => setBusinessNameOfShipper(e.target.value)}
                    onBlur={(e) => {
                      validateShipperBusinessName(e.target.value);
                    }}
                    margin="dense"
                    name="shipper_businessName"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_2" item xs={5}>
            <Grid item xs={10}>
              <Box m={2} pb={1}>
                <FormControl className={classes.inputField} disabled>
                  <label htmlFor="shipper_address">Shipper Address</label>
                  <AutoCompleteAddress
                    autoCompleteHandlerShipper={autoCompleteHandlerShipper}
                    shipper
                    address={addressOfShipper}
                    disabled={shipperAddressTBD}
                    placeholder={shipperAddressTBD}
                  />
                </FormControl>
              </Box>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={4}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="shipper_city">City</label>
                    <TextField
                      id="shipper_city"
                      required
                      value={cityOfShipper}
                      onChange={(e) => setCityOfShipper(e.target.value)}
                      margin="dense"
                      name="shipper_city"
                      fullWidth={true}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="shipper_state">State</label>
                    <TextField
                      id="shipper_state"
                      required
                      value={stateOfShipper}
                      onChange={(e) => setStateOfShipper(e.target.value)}
                      margin="dense"
                      name="shipper_state"
                      fullWidth={true}
                      style={{ width: "70%" }}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="shipper_zip">ZIP</label>
                    <TextField
                      id="shipper_zip"
                      required
                      value={zipOfShipper}
                      onChange={(e) => setZipOfShipper(e.target.value)}
                      margin="dense"
                      name="shipper_zip"
                      fullWidth={true}
                      style={{ width: "80%" }}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid id="column_4" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="shipper_contactName">Contact name</label>
                  <TextField
                    id="shipper_contactName"
                    required
                    value={contactNameOfShipper}
                    onChange={(e) => setContactNameOfShipper(e.target.value)}
                    margin="dense"
                    name="shipper_contactName"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="shipper_email">Email</label>
                  <TextField
                    id="shipper_email"
                    required
                    value={emailOfShipper}
                    onChange={(e) => setEmailOfShipper(e.target.value)}
                    margin="dense"
                    name="shipper_email"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_5" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="shipper_phone">Phone</label>
                  <TextField
                    error={!isPhoneOfShipperValid ? true : false}
                    placeholder={!isPhoneOfShipperValid ? "Required" : null}
                    id="shipper_phone"
                    required
                    value={phoneOfShipper}
                    onChange={(e) => setPhoneOfShipper(e.target.value)}
                    onBlur={(e) => {
                      validateShipperPhone(e.target.value);
                    }}
                    margin="dense"
                    name="shipper_phone"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="shipper_fax">Fax</label>
                  <TextField
                    id="shipper_fax"
                    required
                    value={faxOfShipper}
                    onChange={(e) => setFaxOfShipper(e.target.value)}
                    margin="dense"
                    name="shipper_fax"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );

  let OriginContent = (
    <Grid item xs={12}>
      <Paper elevation={0} variant="outlined">
        <Grid id="subrow_1" item container xs={12}>
          <Grid id="column_1" item container direction="row" xs={12}>
            <Grid item xs={3}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Origin
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box fontSize="h6.fontSize" m={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={originAddressTBD}
                      onChange={() => {
                        originAddressTBDHandler();
                      }}
                      name="originAddressTBD"
                      color="primary"
                    />
                  }
                  label={
                    <span style={{ fontSize: 12 }}>
                      Define origin address later
                    </span>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="businessName">Business name</label>
                  <TextField
                    id="businessName"
                    required
                    value={businessNameOnPickup}
                    onChange={(e) => setBusinessNameOnPickup(e.target.value)}
                    margin="dense"
                    name="businessName"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="pickupScheduledFirstDate">
                    Scheduled pickup date
                  </label>
                  <TextField
                    error={!isScheduledPickupDateValid ? true : false}
                    placeholder={
                      !isScheduledPickupDateValid ? "Required" : null
                    }
                    id="pickupScheduledFirstDate"
                    required
                    type="date"
                    value={scheduledPickupDate}
                    onChange={(e) => setScheduledPickupDate(e.target.value)}
                    onBlur={(e) => {
                      validateOriginDate(e.target.value);
                    }}
                    margin="dense"
                    name="pickupScheduledFirstDate"
                    fullWidth={true}
                    style={{ width: "130%" }}
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_2" item xs={4}>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="businessName">Address</label>
                  <AutoCompleteAddress
                    autoCompleteHandlerPickup={autoCompleteHandlerPickup}
                    pickup
                    address={addressOnPickup}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={5}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="pickup_city">City</label>
                    <TextField
                      id="pickup_city"
                      required
                      value={cityOnPickup}
                      onChange={(e) => setCityOnPickup(e.target.value)}
                      margin="dense"
                      name="pickup_city"
                      fullWidth={true}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="pickup_state">State</label>
                    <TextField
                      id="pickup_state"
                      required
                      style={{ width: "70%" }}
                      value={stateOnPickup}
                      onChange={(e) => setStateOnPickup(e.target.value)}
                      margin="dense"
                      name="pickup_state"
                      fullWidth={true}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box ml={1}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="zip">ZIP</label>
                    <TextField
                      error={!isAddressZipOnPickupValid ? true : false}
                      placeholder={
                        !isAddressZipOnPickupValid ? "Required" : null
                      }
                      id="zip"
                      required
                      value={zipOnPickup}
                      onChange={(e) => setZipOnPickup(e.target.value)}
                      onBlur={(e) => {
                        validateOriginZip(e.target.value);
                      }}
                      margin="dense"
                      name="zip"
                      fullWidth={true}
                      style={{ width: "90%" }}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid id="column_4" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="contactName">Contact name</label>
                  <TextField
                    id="contactName"
                    required
                    value={contactNameOnPickup}
                    onChange={(e) => setContactNameOnPickup(e.target.value)}
                    margin="dense"
                    name="contactName"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="email">Email</label>
                  <TextField
                    id="email"
                    required
                    value={emailOnPickup}
                    onChange={(e) => setEmailOnPickup(e.target.value)}
                    margin="dense"
                    name="email"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_5" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label
                    htmlFor="phone"
                    onClick={() => {
                      setIsEditPhonesOnPickupOpen(true);
                    }}
                  >
                    <StyledBadge
                      badgeContent={
                        phonesOnPickup.length > 0
                          ? `${phonesOnPickup.length} +`
                          : null
                      }
                    >
                      Phone
                    </StyledBadge>
                  </label>

                  <TextField
                    error={!isPhoneOnPickupValid ? true : false}
                    placeholder={!isPhoneOnPickupValid ? "Required" : null}
                    id="phone"
                    required
                    value={phoneOnPickup}
                    onChange={(e) => setPhoneOnPickup(e.target.value)}
                    onBlur={(e) => {
                      validateOriginPhone(e.target.value);
                    }}
                    margin="dense"
                    name="phone"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>

            <Grid item container xs={12} alignItems="flex-end" justify="center">
              <Grid items xs={7}>
                <Box m={2}></Box>
              </Grid>
              <Grid items xs={8}>
                <Box m={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    className={classes.button}
                    onClick={phoneAddPickupHandler}
                    disabled={!phoneOnPickup}
                  >
                    Add phone #
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid id="column_6" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="pickup_notes">Pickup Notes</label>
                  <TextField
                    id="pickup_notes"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    margin="dense"
                    name="pickup_notes"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
  let DestinationContent = (
    <Grid item xs={12}>
      <Paper elevation={0} variant="outlined">
        <Grid id="subrow_1" item container xs={12}>
          <Grid id="column_1" item container direction="row" xs={12}>
            <Grid item xs={3}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Destination
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box fontSize="h6.fontSize" m={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={destinationAddressTBD}
                      onChange={() => {
                        destinationAddressTBDHandler();
                      }}
                      name="destianationAddressTBD"
                      color="primary"
                    />
                  }
                  label={
                    <span style={{ fontSize: 12 }}>
                      Define destination address later
                    </span>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="businessName">Business name</label>
                  <TextField
                    id="businessName"
                    required
                    value={businessNameOnDelivery}
                    onChange={(e) => setBusinessNameOnDelivery(e.target.value)}
                    margin="dense"
                    name="businessName"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="deliveryScheduledFirstDate">
                    Scheduled delivery date
                  </label>
                  <TextField
                    error={!isScheduledDeliveryDateValid ? true : false}
                    placeholder={
                      !isScheduledDeliveryDateValid ? "Required" : null
                    }
                    id="deliveryScheduledFirstDate"
                    required
                    type="date"
                    value={scheduledDeliveryDate}
                    onChange={(e) => setScheduledDeliveryDate(e.target.value)}
                    onBlur={(e) => {
                      validateDestinationDate(e.target.value);
                    }}
                    margin="dense"
                    name="deliveryScheduledFirstDate"
                    fullWidth={true}
                    style={{ width: "130%" }}
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_2" item xs={4}>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="businessName">Address</label>
                  <AutoCompleteAddress
                    autoCompleteHandlerDelivery={autoCompleteHandlerDelivery}
                    delivery
                    address={addressOnDelivery}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={5}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="delivery_city">City</label>
                    <TextField
                      id="delivery_city"
                      required
                      value={cityOnDelivery}
                      onChange={(e) => setCityOnDelivery(e.target.value)}
                      margin="dense"
                      name="delivery_city"
                      fullWidth={true}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="delivery_state">State</label>
                    <TextField
                      id="delivery_state"
                      required
                      style={{ width: "70%" }}
                      value={stateOnDelivery}
                      onChange={(e) => setStateOnDelivery(e.target.value)}
                      margin="dense"
                      name="delivery_state"
                      fullWidth={true}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box ml={1}>
                  <FormControl className={classes.inputField}>
                    <label htmlFor="delivery_zip">ZIP</label>
                    <TextField
                      error={!isAddressZipOnDeliveryValid ? true : false}
                      placeholder={
                        !isAddressZipOnDeliveryValid ? "Required" : null
                      }
                      id="delivery_zip"
                      required
                      value={zipOnDelivery}
                      onChange={(e) => setZipOnDelivery(e.target.value)}
                      onBlur={(e) => {
                        validateDestinationZip(e.target.value);
                      }}
                      margin="dense"
                      name="delivery_zip"
                      fullWidth={true}
                      style={{ width: "90%" }}
                      variant="outlined"
                      InputProps={{
                        classes: { input: classes.inputText },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid id="column_4" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="contactName">Contact name</label>
                  <TextField
                    id="contactName"
                    required
                    value={contactNameOnDelivery}
                    onChange={(e) => setContactNameOnDelivery(e.target.value)}
                    margin="dense"
                    name="contactName"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="email">Email</label>
                  <TextField
                    id="email"
                    required
                    value={emailOnDelivery}
                    onChange={(e) => setEmailOnDelivery(e.target.value)}
                    margin="dense"
                    name="email"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_5" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label
                    htmlFor="phone"
                    onClick={() => {
                      setIsEditPhonesOnDeliveryOpen(true);
                    }}
                  >
                    <StyledBadge
                      badgeContent={
                        phonesOnDelivery.length > 0
                          ? `${phonesOnDelivery.length} +`
                          : null
                      }
                    >
                      Phone
                    </StyledBadge>
                  </label>

                  <TextField
                    error={!isPhoneOnDeliveryValid ? true : false}
                    placeholder={!isPhoneOnDeliveryValid ? "Required" : null}
                    id="phone"
                    required
                    value={phoneOnDelivery}
                    onChange={(e) => setPhoneOnDelivery(e.target.value)}
                    onBlur={(e) => {
                      validateDestinationPhone(e.target.value);
                    }}
                    margin="dense"
                    name="phone"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>

            <Grid item container xs={12} alignItems="flex-end" justify="center">
              <Grid items xs={7}>
                <Box m={2}></Box>
              </Grid>
              <Grid items xs={8}>
                <Box m={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    className={classes.button}
                    onClick={phoneAddDeliveryHandler}
                    disabled={!phoneOnDelivery}
                  >
                    Add phone #
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid id="column_6" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="delivery_notes">Delivery Notes</label>
                  <TextField
                    id="delivery_notes"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    margin="dense"
                    name="delivery_notes"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );

  let VehicleContent = (
    <Grid item xs={12}>
      <Paper elevation={0} variant="outlined">
        <Grid id="subrow_1" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  {totalVehicles.length === 0
                    ? "No vehicles added"
                    : `# of vehicles: ${totalVehicles.length}`}
                </Box>
              </Typography>
            </Grid>
          </Grid>
          <Grid id="column_2" item xs={2}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  {!isEditVehicleMode && (
                    <Button
                      onClick={addVehicleHandler}
                      disabled={!make || !year}
                      variant="outlined"
                      size="small"
                      className={classes.button}
                    >
                      Add+
                    </Button>
                  )}
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <TableContainer>
            <Table className={classes.table} aria-label="vehicle input table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell} width="20%">
                    VIN
                  </TableCell>
                  <TableCell className={classes.tableCell} width="8%">
                    Year
                  </TableCell>
                  <TableCell className={classes.tableCell} width="20%">
                    Make
                  </TableCell>
                  <TableCell className={classes.tableCell} width="20%">
                    Model
                  </TableCell>
                  <TableCell className={classes.tableCell} width="10%">
                    Lot #
                  </TableCell>
                  <TableCell className={classes.tableCell} width="10%">
                    Type
                  </TableCell>
                  <TableCell className={classes.tableCell} width="5%">
                    Inop
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    width="5%"
                  ></TableCell>
                  <TableCell
                    className={classes.tableCell}
                    width="5%"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalVehicles.map((vehicle, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      {vehicle.vin}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {vehicle.year}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {vehicle.make} {vehicle.isVehicleRecognitionError ? <ReportProblemIcon color="error" fontSize="small"/>  : null} 
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {vehicle.model}
                    </TableCell>

                    <TableCell className={classes.tableCell}>
                      {vehicle.lotNumber}
                    </TableCell>

                    <TableCell className={classes.tableCell}>
                      {vehicle.type}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {vehicle.inoperable ? <CheckIcon /> : ""}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          removeVehicleHandler(index);
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          editVehicleHandler(index);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="left">
                    <FormControl>
                      <TextField
                        id="vin"
                        required
                        value={vin}
                        onChange={orderVehiclesVinAutoFillHandler}
                        margin="dense"
                        name="vin"
                        variant="outlined"
                        InputProps={{ classes: { input: classes.inputText } }}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <FormControl>
                      <TextField
                        error={!isYearValid ? true : false}
                        placeholder={!isYearValid ? "Required" : null}
                        id="year"
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        margin="dense"
                        name="year"
                        variant="outlined"
                        InputProps={{ classes: { input: classes.inputText } }}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <div style={{ width: 130 }}>
                      <Autocomplete
                        id="make-autocomplete"
                        name="make"
                        value={make}
                        style={{ width: "160%" }}
                        classes={{
                          input: classes.vehicleInput,
                        }}
                        onChange={(event, newValue) => {
                          setMakeModelHandler(newValue);
                        }}
                        options={makes.map((vehicle) => vehicle.make)}
                        renderInput={(params) => (
                          <div>
                            <TextField
                              {...params}
                              error={!isMakeValid ? true : false}
                              placeholder={!isMakeValid ? "Required" : null}
                              id="make"
                              required
                              value={make}
                              margin="dense"
                              name="make"
                              variant="outlined"
                            />
                          </div>
                        )}
                      ></Autocomplete>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    <div style={{ width: 130 }}>
                      <Autocomplete
                        id="model-autocomplete"
                        name="model"
                        freeSolo
                        autoSelect
                        style={{ width: "160%" }}
                        classes={{
                          input: classes.vehicleInput,
                        }}
                        clearOnBlur
                        disabled={!make && !modelsArray}
                        value={model}
                        onChange={(event, newValue) => {
                          setModel(newValue);
                        }}
                        options={
                          modelsArray &&
                          modelsArray.map((vehicle) => vehicle.model)
                        }
                        renderInput={(params) => (
                          <div>
                            <TextField
                              {...params}
                              error={!isModelValid ? true : false}
                              placeholder={!isModelValid ? "Required" : null}
                              id="model"
                              required
                              margin="dense"
                              name="model"
                              variant="outlined"
                            />
                          </div>
                        )}
                      ></Autocomplete>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    <FormControl>
                      <TextField
                        id="lot_number"
                        required
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                        margin="dense"
                        name="lot_number"
                        variant="outlined"
                        InputProps={{ classes: { input: classes.inputText } }}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <Select
                        id="type"
                        margin="dense"
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ fontSize: 12, width: "100%" }}
                      >
                        <MenuItem value={CarTypes.CAR}>Car</MenuItem>
                        <MenuItem value={CarTypes.PICKUP}>Pickup truck</MenuItem>
                        <MenuItem value={CarTypes.SUV}>SUV</MenuItem>
                        <MenuItem value={CarTypes.VAN}>Van</MenuItem>
                      </Select>
                    </FormControl>{" "}
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inoperable}
                          onChange={(e) => setInoperable(e.target.checked)}
                          name="inoperable"
                          color="primary"
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>

                <Collapse in={updateButtonShow} timeout="auto" unmountOnExit>
                  <TableRow>
                    <Box m={2}>
                      <ButtonGroup
                        variant="outlined"
                        color="primary"
                        aria-label="contained primary button group"
                      >
                        <Button onClick={updateButtonHandler}>Update</Button>
                        <Button onClick={cancelButtonHandler}>Cancel</Button>
                      </ButtonGroup>
                    </Box>
                  </TableRow>
                </Collapse>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Paper>
    </Grid>
  );

  let InstructionsContent = (
    <Grid item xs={12}>
      <Paper elevation={0} variant="outlined">
        <Grid id="subrow_1" item container xs={12}>
          <Grid id="column_1" item xs={12}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Order instructions
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={12}>
            <Grid item xs={12}>
              <Box m={2}>
                <TextField
                  id="instructions"
                  required
                  fullWidth={true}
                  multiline
                  rows={4}
                  // style={{ width: "500px" }}
                  value={orderInstructions}
                  onChange={(e) => setOrderInstructions(e.target.value)}
                  margin="dense"
                  name="instructions"
                  variant="outlined"
                  InputProps={{
                    classes: { input: classes.inputText },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );

  let PaymentContent = (
    <Grid item xs={12}>
      <Paper elevation={0} variant="outlined">
        <Grid id="subrow_1" item container xs={12}>
          <Grid id="column_1" item xs={8}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Financial
                </Box>
              </Typography>
            </Grid>
          </Grid>
          <Grid id="column_2" item xs={4}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Invoice
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2} pb={0.5}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="orderAmount">Order Amount</label>
                  <TextField
                    error={!isOrderAmountValid ? true : false}
                    placeholder={!isOrderAmountValid ? "Required" : null}
                    id="orderAmount"
                    required
                    value={orderAmount}
                    placeholder={"$"}
                    style={{ width: "70%" }}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    onBlur={(e) => {
                      validateOrderAmount(e.target.value);
                    }}
                    margin="dense"
                    name="orderAmount"
                    variant="outlined"
                    InputProps={{
                      classes: { input: classes.inputText },
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl variant="outlined" className={classes.inputField}>
                  <label htmlFor="paymentTerms" style={{ paddingBottom: 8 }}>
                    Terms
                  </label>
                  <Select
                    error={!isPaymentTermsValid ? true : false}
                    placeholder={!isPaymentTermsValid ? "Required" : null}
                    id="paymentTerms"
                    margin="dense"
                    style={{ fontSize: 12, width: "170%" }}
                    name="paymentTerms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    onBlur={(e) => {
                      validatePaymentTerms(e.target.value);
                    }}
                    InputProps={{ classes: { input: classes.inputText } }}
                  >
                    <MenuItem value={PaymentTerms.COD}>COD</MenuItem>
                    <MenuItem value={PaymentTerms.COP}>COP</MenuItem>
                    <MenuItem value={PaymentTerms.DAYS_2}>QuickPay</MenuItem>
                    <MenuItem value={PaymentTerms.DAYS_5}>5 days</MenuItem>
                    <MenuItem value={PaymentTerms.DAYS_10}>10 days</MenuItem>
                    <MenuItem value={PaymentTerms.DAYS_15}>15 days</MenuItem>
                    <MenuItem value={PaymentTerms.DAYS_20}>20 days</MenuItem>
                    <MenuItem value={PaymentTerms.DAYS_30}>30 days</MenuItem>
                  </Select>
                </FormControl>{" "}
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_2" item xs={2}>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl variant="outlined" className={classes.inputField}>
                  <label htmlFor="paymentMethod" style={{ paddingBottom: 8 }}>
                    Method
                  </label>
                  <Select
                    error={!isPaymentMethodValid ? true : false}
                    placeholder={!isPaymentMethodValid ? "Required" : null}
                    id="paymentMethod"
                    margin="dense"
                    style={{ fontSize: 12, width: "190%" }}
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    onBlur={(e) => {
                      validatePaymentMethod(e.target.value);
                    }}
                    InputProps={{ classes: { input: classes.inputText } }}
                  >
                    <MenuItem value={PaymentMethods.CASH}>Cash</MenuItem>
                    <MenuItem value={PaymentMethods.CERTIFIED_FUNDS}>
                      Certified funds
                    </MenuItem>
                    <MenuItem value={PaymentMethods.COMCHEK}>Comchek</MenuItem>
                    <MenuItem value={PaymentMethods.ACH}>ACH</MenuItem>
                    <MenuItem value={PaymentMethods.COMPANY_CHECK}>Company check</MenuItem>
                    <MenuItem value={PaymentMethods.MOBILE_PAYMENT}>Mobile payment</MenuItem>
                  </Select>
                </FormControl>{" "}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl variant="outlined" className={classes.inputField}>
                  <label htmlFor="paymentUpon" style={{ paddingBottom: 8 }}>
                    Payment start upon
                  </label>
                  <Select
                    error={!isPaymentStartUponValid ? true : false}
                    placeholder={!isPaymentStartUponValid ? "Required" : null}
                    id="paymentUpon"
                    margin="dense"
                    style={{ fontSize: 12, width: "100%" }}
                    name="paymentUpon"
                    value={paymentStartUpon}
                    onChange={(e) => setPaymentStartUpon(e.target.value)}
                    onBlur={(e) => {
                      validatePaymentStartDate(e.target.value);
                    }}
                    InputProps={{ classes: { input: classes.inputText } }}
                  >
                    <MenuItem value={PaymentStartUpon.PICKUP}>Pickup</MenuItem>
                    <MenuItem value={PaymentStartUpon.DELIVERY}>Delivery</MenuItem>
                    <MenuItem value={PaymentStartUpon.RECEIVING_BOL}>Receiving BOL</MenuItem>
                  </Select>
                </FormControl>{" "}
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_3" item xs={4}>
            <Grid item xs={12}>
              <Box m={2} pb={0.5}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="driverPay">Driver pay</label>
                  <TextField
                    id="driverPay"
                    required
                    style={{ width: "70%" }}
                    placeholder={"$"}
                    value={driverPay}
                    onChange={(e) => setDriverPay(e.target.value)}
                    margin="dense"
                    name="driverPay"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="brokerFee">Broker Fee</label>
                  <TextField
                    id="brokerFee"
                    required
                    style={{ width: "70%" }}
                    placeholder={"$"}
                    value={brokerFee}
                    onChange={(e) => setBrokerFee(e.target.value)}
                    margin="dense"
                    name="brokerFee"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_4" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="carrierInvoiceId">Invoice ID</label>
                  <TextField
                    id="carrierInvoiceId"
                    required
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    margin="dense"
                    name="carrierInvoiceId"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="invoiceRecipientEmail">Recipient email</label>
                  <TextField
                    id="invoiceRecipientEmail"
                    required
                    value={invoiceEmail}
                    onChange={(e) => setInvoiceEmail(e.target.value)}
                    margin="dense"
                    name="invoiceRecipientEmail"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_5" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label htmlFor="invoiceNotes">Notes</label>
                  <TextField
                    id="invoiceNotes"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    margin="dense"
                    name="invoiceNotes"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.inputText } }}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );

  return (
    <div>
      <NavBar>
        <Head>
          <title>C|Transporter - Create an Order</title>
        </Head>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <Toolbar className={classes.upperToolBar}>
            <Grid container>
              <Grid item xs={2}>
                <Typography variant="h6" noWrap>
                  New Load
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveOrderHandler}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" fixed>
          <Grid container spacing={2} className={classes.container}>
            <Grid id="row_1" item container xs={12}>
              <Grid item xs={12}>
                <Paper elevation={0} variant="outlined">
                  <Box m={2}>
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        acceptedFiles.forEach((file) => {
                          const reader = new FileReader()
                    
                          reader.onabort = () => console.log('file reading was aborted')
                          reader.onerror = () => console.log('file reading has failed')
                          reader.onload = () => {
                          // Do whatever you want with the file contents
                            const binaryStr = reader.result
                            uploadFileParser(binaryStr)
                          }
                          reader.readAsArrayBuffer(file)
                        })
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                            {uploadedSpinner? <CircularProgress/> : null}
                            
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Grid id="row_2" item container xs={12}>
              {GeneralTermsContent}
            </Grid>

            <Grid id="row_3" item container xs={12}>
              {OriginContent}
            </Grid>

            <Grid id="row_4" item container xs={12}>
              {DestinationContent}
            </Grid>
            <Grid id="row_5" item container xs={12}>
              {VehicleContent}
            </Grid>
            <Grid id="row_5.1" item container xs={12}>
              {InstructionsContent}
            </Grid>

            <Grid id="row_6" item container xs={12}>
              {PaymentContent}
            </Grid>
          </Grid>
          {editPhoneOnPickupDialog}
          {editPhoneOnDeliveryDialog}
        </Container>
      </NavBar>
    </div>
  );
}

export default withAuth(createOrder);
