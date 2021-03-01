import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
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
import {withAuth} from "../../utils/withAuth"

import EditPhoneDialog from "../../components/order/dialogs/EditPhonesDialog";
import EditPhoneDialogDelivery from "../../components/order/dialogs/EditPhonesDialogDelivery";
import AutoCompleteAddress from "../../components/order/AutoCompleteAddress";
import { makes } from "../../src/makes";

import axios from "axios";
const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  appBar: {
    marginTop: 0,
    border: 2,
  },
  upperToolBar: {
    color: "#d7d5da",
    background: "#432c7d",
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
  saveButton: {
    color: "white",
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

function EditOrder(props) {
  const classes = useStyles();
  const [isEditPhonesOnPickupOpen, setIsEditPhonesOnPickupOpen] = useState("");
  const [isEditPhonesOnDeliveryOpen, setIsEditPhonesOnDeliveryOpen] = useState(
    ""
  );
  const [shipperOrderId, setShipperOrderId] = useState(
    props.orderData.data.shipperOrderId
  );
  const [carrierOrderId, setCarrierOrderId] = useState("");
  const [orderInstructions, setOrderInstructions] = useState("");
  //Origin
  const [businessNameOnPickup, setBusinessNameOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.businessName
  );
  const [addressOnPickup, setAddressOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.address
  );
  const [placeIdOnPickup, setPlaceIdOnPickup] = useState("");
  const [zipOnPickup, setZipOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.zip
  );
  const [cityOnPickup, setCityOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.city
  );
  const [stateOnPickup, setStateOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.state
  );
  const [scheduledPickupDate, setScheduledPickupDate] = useState(
    props.orderData.data.pickup.pickupScheduledFirstDate
  );
  const [pickupNotes, setPickupNotes] = useState(
    props.orderData.data.pickup.pickupNotes
  );
  const [contactNameOnPickup, setContactNameOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.contactName
  );
  const [emailOnPickup, setEmailOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.email
  );
  const [phoneOnPickup, setPhoneOnPickup] = useState(
    props.orderData.data.pickup.pickupAddress.phone
  );
  const [phonesOnPickup, setPhonesOnPickup] = useState(props.orderData.data.pickup.pickupAddress.phones);
  const [faxOnPickup, setFaxOnPickup] = useState("");
  //Destination
  const [businessNameOnDelivery, setBusinessNameOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.businessName
  );
  const [addressOnDelivery, setAddressOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.address
  );
  const [placeIdOnDelivery, setPlaceIdOnDelivery] = useState("");
  const [zipOnDelivery, setZipOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.zip
  );
  const [cityOnDelivery, setCityOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.city
  );
  const [stateOnDelivery, setStateOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.state
  );
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState(
    props.orderData.data.delivery.deliveryScheduledFirstDate
  );
  const [deliveryNotes, setDeliveryNotes] = useState(
    props.orderData.data.delivery.deliveryNotes
  );
  const [contactNameOnDelivery, setContactNameOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.contactName
  );
  const [emailOnDelivery, setEmailOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.email
  );
  const [phoneOnDelivery, setPhoneOnDelivery] = useState(
    props.orderData.data.delivery.deliveryAddress.phone
  );
  const [phonesOnDelivery, setPhonesOnDelivery] = useState(props.orderData.data.delivery.deliveryAddress.phones);
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
  const [inoperable, setInoperable] = useState("");
  const [totalVehicles, setTotalVehicles] = useState(
    props.orderData.data.vehiclesArray
  );
  const [isEditVehicleMode, setIsEditVehicleMode] = useState(false);
  const [updateButtonShow, setUpdateButtonShow] = useState(false); //state for update button
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(""); //state for storing selected row index to update it in parent component
  const [modelsArray, setModelsArray] = useState(""); //state for storing selected row index to update it in parent component

  //payment
  const [orderAmount, setOrderAmount] = useState(
    props.orderData.data.orderPayment.orderAmount
  );
  const [driverPay, setDriverPay] = useState(
    props.orderData.data.orderPayment.driverPay
  );
  const [brokerFee, setBrokerFee] = useState(
    props.orderData.data.orderPayment.brokerFee
  );
  const [paymentMethod, setPaymentMethod] = useState(
    props.orderData.data.orderPayment.paymentMethod
  );
  const [paymentTerms, setPaymentTerms] = useState(
    props.orderData.data.orderPayment.paymentTerms
  );
  const [paymentStartUpon, setPaymentStartUpon] = useState(
    props.orderData.data.orderPayment.paymentUpon
  );
  const [invoiceId, setInvoiceId] = useState(
    props.orderData.data.orderInvoice.carrierInvoiceId
  );
  const [invoiceEmail, setInvoiceEmail] = useState(
    props.orderData.data.orderInvoice.invoiceRecipientEmail
  );
  const [invoiceNotes, setInvoiceNotes] = useState(
    props.orderData.data.orderInvoice.invoiceNotes
  );

  //shipper
  const [businessNameOfShipper, setBusinessNameOfShipper] = useState(
    props.orderData.data.shipper.businessName
  );
  const [addressOfShipper, setAddressOfShipper] = useState(
    props.orderData.data.shipper.address
  );
  const [placeIdOfShipper, setPlaceIdOfShipper] = useState("");
  const [cityOfShipper, setCityOfShipper] = useState(
    props.orderData.data.shipper.city
  );
  const [stateOfShipper, setStateOfShipper] = useState(
    props.orderData.data.shipper.state
  );
  const [zipOfShipper, setZipOfShipper] = useState(
    props.orderData.data.shipper.zip
  );
  const [contactNameOfShipper, setContactNameOfShipper] = useState(
    props.orderData.data.shipper.contactName
  );
  const [emailOfShipper, setEmailOfShipper] = useState(
    props.orderData.data.shipper.email
  );
  const [phoneOfShipper, setPhoneOfShipper] = useState(
    props.orderData.data.shipper.phone
  );
  const [faxOfShipper, setFaxOfShipper] = useState(
    props.orderData.data.shipper.fax
  );

  //USEEFFECTS
  //ZIP finder
  useEffect(() => {
    const result = async () => {
      const respond = await axios.post("/api/geo/get-zip-by-place-id", {
        placeId: placeIdOnPickup,
      });
      setZipOnPickup(respond.data.zip);
      setCityOnPickup(respond.data.city);
      setStateOnPickup(respond.data.state);
    };
    result();
  }, [placeIdOnPickup]);
  //ZIP finder
  useEffect(() => {
    const result = async () => {
      const respond = await axios.post("/api/geo/get-zip-by-place-id", {
        placeId: placeIdOnDelivery,
      });
      setZipOnDelivery(respond.data.zip);
      setCityOnDelivery(respond.data.city);
      setStateOnDelivery(respond.data.state);
    };
    result();
  }, [placeIdOnDelivery]);
  //ZIP finder
  useEffect(() => {
    const result = async () => {
      const respond = await axios.post("/api/geo/get-zip-by-place-id", {
        placeId: placeIdOfShipper,
      });
      setZipOfShipper(respond.data.zip);
      setCityOfShipper(respond.data.city);
      setStateOfShipper(respond.data.state);
    };
    result();
  }, [placeIdOfShipper]);

  //Models array setter
  useEffect(() => {
    async function result() {
      const result = await axios.post("/api/vehicles/get-models-by-make", {
        make: make,
      });
      setModelsArray(result.data);
    }
    result();
  }, [make]);

  // add vehicle to array
  const addVehicleHandler = () => {
    let currentVehiclesArray = [...totalVehicles];
    let newVehicle = {
      vin: vin,
      year: year,
      make: make,
      model: model,
      color: color,
      inoperable: inoperable,
      lot_number: lotNumber,
      type: type,
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

  const autoCompleteHandlerPickup = async (description, reference) => {
    if (description) {
      setAddressOnPickup(description);
      setPlaceIdOnPickup(reference);
      // setPlaceIdOnPickup(place_id)
    }
  };
  const autoCompleteHandlerDelivery = async (description, place_id) => {
    if (description) {
      setAddressOnDelivery(description);
      setPlaceIdOnDelivery(place_id);
      // setPlaceIdOnPickup(place_id)
    }
  };
  const autoCompleteHandlerShipper = async (description, place_id) => {
    if (description) {
      setAddressOfShipper(description);
      setPlaceIdOfShipper(place_id);
      // setPlaceIdOnPickup(place_id)
    }
  };

  //Vin autocomplete handler
  const orderVehiclesVinAutoFillHandler = async (event) => {
    setVin(event.target.value);
    if (event.target.value.length === 17) {
      const vinData = await axios.post("/api/vehicles/get-vin", {
        vin: event.target.value,
      });
      setYear(vinData.data.ModelYear);
      setMake(vinData.data.Make);
      setModel(vinData.data.Model);
    }
  };

  //save handler
  const saveOrderHandler = async () => {
    console.log("In first call")
    let respond = await axios.post("/api/orders/order-edit", {
      carrierId: props.carrierId,
      orderId: props.orderId,
      userId: props.userId,
      token: props.token,
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
    });
    console.log(respond)
    props.closeDialogHandler()
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
          <Grid id="column_1" item xs={12}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Order details
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label for="shipper_id">Shipper ID</label>
                  <TextField
                    id="shipper_id"
                    required
                    value={shipperOrderId}
                    onChange={(e) => setShipperOrderId(e.target.value)}
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
                  <label for="shipper_businessName">Shipper name</label>
                  <TextField
                    id="shipper_businessName"
                    required
                    value={businessNameOfShipper}
                    onChange={(e) => setBusinessNameOfShipper(e.target.value)}
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
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl className={classes.inputField}>
                  <label for="shipper_address">Address</label>
                  <AutoCompleteAddress
                    autoCompleteHandlerShipper={autoCompleteHandlerShipper}
                    shipper
                    address={addressOfShipper}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={4}>
                <Box ml={2}>
                  <FormControl className={classes.inputField}>
                    <label for="shipper_city">City</label>
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
                    <label for="shipper_state">State</label>
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
                    <label for="shipper_zip">ZIP</label>
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
                  <label for="shipper_contactName">Contact name</label>
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
                  <label for="shipper_email">Email</label>
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
                  <label for="shipper_phone">Phone</label>
                  <TextField
                    id="shipper_phone"
                    required
                    value={phoneOfShipper}
                    onChange={(e) => setPhoneOfShipper(e.target.value)}
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
                  <label for="shipper_fax">Fax</label>
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
          <Grid id="column_1" item xs={12}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Origin
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label for="businessName">Business name</label>
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
                  <label for="pickupScheduledFirstDate">
                    Scheduled pickup date
                  </label>
                  <TextField
                    id="pickupScheduledFirstDate"
                    required
                    type="date"
                    value={scheduledPickupDate}
                    onChange={(e) => setScheduledPickupDate(e.target.value)}
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
                  <label for="businessName">Address</label>
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
                    <label for="pickup_city">City</label>
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
                    <label for="pickup_state">State</label>
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
                    <label for="zip">ZIP</label>
                    <TextField
                      id="zip"
                      required
                      value={zipOnPickup}
                      onChange={(e) => setZipOnPickup(e.target.value)}
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
                  <label for="contactName">Contact name</label>
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
                  <label for="email">Email</label>
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
                    for="phone"
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
                    id="phone"
                    required
                    value={phoneOnPickup}
                    onChange={(e) => setPhoneOnPickup(e.target.value)}
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
                  <label for="pickup_notes">Pickup Notes</label>
                  <TextField
                    id="pickup_notes"
                    defaultValue=""
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
          <Grid id="column_1" item xs={12}>
            <Grid item xs={12}>
              <Typography>
                <Box fontSize="h6.fontSize" m={2}>
                  Destination
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid id="subrow_2" item container xs={12}>
          <Grid id="column_1" item xs={2}>
            <Grid item xs={12}>
              <Box m={2}>
                <FormControl className={classes.inputField}>
                  <label for="businessName">Business name</label>
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
                  <label for="deliveryScheduledFirstDate">
                    Scheduled delivery date
                  </label>
                  <TextField
                    id="deliveryScheduledFirstDate"
                    required
                    type="date"
                    value={scheduledDeliveryDate}
                    onChange={(e) => setScheduledDeliveryDate(e.target.value)}
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
                  <label for="businessName">Address</label>
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
                    <label for="delivery_city">City</label>
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
                    <label for="delivery_state">State</label>
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
                    <label for="delivery_zip">ZIP</label>
                    <TextField
                      id="delivery_zip"
                      required
                      value={zipOnDelivery}
                      onChange={(e) => setZipOnDelivery(e.target.value)}
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
                  <label for="contactName">Contact name</label>
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
                  <label for="email">Email</label>
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
                    for="phone"
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
                    id="phone"
                    required
                    value={phoneOnDelivery}
                    onChange={(e) => setPhoneOnDelivery(e.target.value)}
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
                  <label for="delivery_notes">Delivery Notes</label>
                  <TextField
                    id="delivery_notes"
                    defaultValue=""
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
                      {vehicle.make}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {vehicle.model}
                    </TableCell>

                    <TableCell className={classes.tableCell}>
                      {vehicle.lot_number}
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
                        defaultValue=""
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
                        id="year"
                        defaultValue=""
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
                          setMake(newValue);
                        }}
                        options={makes.map((vehicle) => vehicle.make)}
                        renderInput={(params) => (
                          <div>
                            <TextField
                              {...params}
                              id="make"
                              defaultValue=""
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
                        style={{ width: "160%" }}
                        classes={{
                          input: classes.vehicleInput,
                        }}
                        clearOnBlur
                        disabled={!make}
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
                              id="model"
                              defaultValue=""
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
                        defaultValue=""
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
                        <MenuItem value={"car"}>Car</MenuItem>
                        <MenuItem value={"pickup_truck"}>Pickup truck</MenuItem>
                        <MenuItem value={"suv"}>SUV</MenuItem>
                        <MenuItem value={"minivan"}>Minivan</MenuItem>
                        <MenuItem value={"large_van"}>large Van</MenuItem>
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
                  <label for="orderAmount">Order Amount</label>
                  <TextField
                    id="orderAmount"
                    required
                    value={orderAmount}
                    placeholder={"$"}
                    style={{ width: "70%" }}
                    onChange={(e) => setOrderAmount(e.target.value)}
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
                  <label for="paymentMethod" style={{ paddingBottom: 8 }}>
                    Method
                  </label>
                  <Select
                    id="paymentMethod"
                    margin="dense"
                    style={{ fontSize: 12, width: "190%" }}
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    InputProps={{ classes: { input: classes.inputText } }}
                  >
                    <MenuItem value={"cash"}>Cash</MenuItem>
                    <MenuItem value={"certified_finds"}>
                      Certified funds
                    </MenuItem>
                    <MenuItem value={"comchek"}>Comchek</MenuItem>
                    <MenuItem value={"ach"}>ACH</MenuItem>
                    <MenuItem value={"company_check"}>Company check</MenuItem>
                    <MenuItem value={"mobile_payment"}>Mobile payment</MenuItem>
                  </Select>
                </FormControl>{" "}
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_2" item xs={2}>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl variant="outlined" className={classes.inputField}>
                  <label for="paymentTerms" style={{ paddingBottom: 8 }}>
                    Terms
                  </label>
                  <Select
                    id="paymentTerms"
                    margin="dense"
                    style={{ fontSize: 12, width: "170%" }}
                    name="paymentTerms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    InputProps={{ classes: { input: classes.inputText } }}
                  >
                    <MenuItem value={"cod"}>COD</MenuItem>
                    <MenuItem value={"cop"}>COP</MenuItem>
                    <MenuItem value={"2"}>QuickPay</MenuItem>
                    <MenuItem value={"5"}>5 days</MenuItem>
                    <MenuItem value={"10"}>10 days</MenuItem>
                    <MenuItem value={"15"}>15 days</MenuItem>
                    <MenuItem value={"20"}>20 days</MenuItem>
                    <MenuItem value={"30"}>30 days</MenuItem>
                  </Select>
                </FormControl>{" "}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box m={2} pb={1}>
                <FormControl variant="outlined" className={classes.inputField}>
                  <label for="paymentUpon" style={{ paddingBottom: 8 }}>
                    Payment start upon
                  </label>
                  <Select
                    id="paymentUpon"
                    margin="dense"
                    style={{ fontSize: 12, width: "100%" }}
                    name="paymentUpon"
                    value={paymentStartUpon}
                    onChange={(e) => setPaymentStartUpon(e.target.value)}
                    InputProps={{ classes: { input: classes.inputText } }}
                  >
                    <MenuItem value={"pickup"}>Pickup</MenuItem>
                    <MenuItem value={"delivery"}>Delivery</MenuItem>
                  </Select>
                </FormControl>{" "}
              </Box>
            </Grid>
          </Grid>

          <Grid id="column_3" item xs={4}>
            <Grid item xs={12}>
              <Box m={2} pb={0.5}>
                <FormControl className={classes.inputField}>
                  <label for="driverPay">Driver pay</label>
                  <TextField
                    id="driverPay"
                    defaultValue=""
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
                  <label for="brokerFee">Broker Fee</label>
                  <TextField
                    id="brokerFee"
                    defaultValue=""
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
                  <label for="carrierInvoiceId">Invoice ID</label>
                  <TextField
                    id="carrierInvoiceId"
                    defaultValue=""
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
                  <label for="invoiceRecipientEmail">Recipient email</label>
                  <TextField
                    id="invoiceRecipientEmail"
                    defaultValue=""
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
                  <label for="invoiceNotes">Notes</label>
                  <TextField
                    id="invoiceNotes"
                    defaultValue=""
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
      
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.upperToolBar}>
          <Grid container>
            <Grid item xs={2}>
              <Typography variant="h6" noWrap>
                Update load # {props.orderData.data.shipperOrderId}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="inherit"
                classes={{
                  root: classes.saveButton,
                }}
                onClick={saveOrderHandler}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="inherit"
                classes={{
                  root: classes.saveButton,
                }}
                onClick={props.closeDialogHandler}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" fixed>
        <Grid container spacing={2} className={classes.container}>
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
          <Grid id="row_6" item container xs={12}>
            {PaymentContent}
          </Grid>
        </Grid>
        {editPhoneOnPickupDialog}
        {editPhoneOnDeliveryDialog}
      </Container>
    
    </div>
  );
}

export default withAuth(EditOrder)