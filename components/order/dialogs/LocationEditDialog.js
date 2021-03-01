import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Box";

import axios from "axios";
import {loadStatus} from "../../../utils/status"

import AutoCompleteAddress from "../AutoCompleteAddress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 250,
  },
  testField: {
    padding: theme.spacing(2),
    minWidth: 130,
  },
  input: {
    height: 15,
  },
  button: {
    height: "2rem",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 2,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function LocationEditDialog(props) {
  const classes = useStyles();
  //set states for input handlers
  const [businessName, setBusinessName] = useState(" ");
  const [address, setAddress] = useState(" ");
  const [city, setCity] = useState(" ");
  const [state, setState] = useState(" ");
  const [zip, setZip] = useState(" ");
  const [scheduledPickupDate, setScheduledPickupDate] = useState(" ");
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState(" ");
  const [pickupNotes, setPickupNotes] = useState(" ");
  const [deliveryNotes, setDeliveryNotes] = useState(" ");
  const [contactName, setContactName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [phone, setPhone] = useState(" ");
  const [fax, setFax] = useState(" ");

  useEffect(() => {
    if (props.pickup) {
      setBusinessName(props.orderData.pickup.pickupAddress.businessName);
      setAddress(props.orderData.pickup.pickupAddress.address);
      setCity(props.orderData.pickup.pickupAddress.city);
      setState(props.orderData.pickup.pickupAddress.state);
      setZip(props.orderData.pickup.pickupAddress.zip);
      setScheduledPickupDate(
        props.orderData.pickup.pickupScheduledFirstDate
      );
      setScheduledDeliveryDate(
        props.orderData.delivery.deliveryScheduledFirstDate
      );
      setPickupNotes(props.orderData.pickup.pickupNotes);
      setContactName(props.orderData.pickup.pickupAddress.contactName);
      setEmail(props.orderData.pickup.pickupAddress.email);
      setPhone(props.orderData.pickup.pickupAddress.phone);
      setFax(props.orderData.pickup.pickupAddress.fax);
    }
    if (!props.pickup) {
      setBusinessName(props.orderData.delivery.deliveryAddress.businessName);
      setAddress(props.orderData.delivery.deliveryAddress.address);
      setCity(props.orderData.delivery.deliveryAddress.city);
      setState(props.orderData.delivery.deliveryAddress.state);
      setZip(props.orderData.delivery.deliveryAddress.zip);
      setScheduledPickupDate(
        props.orderData.delivery.deliveryScheduledFirstDate
      );
      setScheduledDeliveryDate(
        props.orderData.delivery.deliveryScheduledFirstDate
      );
      setPickupNotes(props.orderData.delivery.deliveryNotes);
      setContactName(props.orderData.delivery.deliveryAddress.contactName);
      setEmail(props.orderData.delivery.deliveryAddress.email);
      setPhone(props.orderData.delivery.deliveryAddress.phone);
      setFax(props.orderData.delivery.deliveryAddress.fax);
    }
  }, []);

  const saveChangesUpdateOrderHandler = async () => {
    if (props.pickup) {
      try {
        await axios.post("/api/orders/order-update-pickup-location", {
          orderId: props.orderId,
          carrierId: props.carrierId,
          scheduledPickupDate,
          address,
          city,
          state,
          zip,
          businessName,
          contactName,
          email,
          phone,
          fax,
        });
        props.reloadHandler();
      } catch (err) {
        console.log(err);
      }
    }
    if (!props.pickup) {
      try {
        await axios.post("/api/orders/order-update-delivery-location", {
          orderId: props.orderId,
          carrierId: props.carrierId,
          scheduledDeliveryDate,
          address,
          city,
          state,
          zip,
          businessName,
          contactName,
          email,
          phone,
          fax,
        });
        props.reloadHandler();
      } catch (err) {
        console.log(err);
      }
    }
    props.closePickupEditDialog();
  };

  const autoCompleteHandlerComponent = async (autoFillAddress, place_id) => {
    if (autoFillAddress) {
      //     let zip = await axios.post(
      //   "/api/geo/get-zip-by-place-id",
      //   {
      //     place_id: place_id,
      //   }
      // );
      setCity(autoFillAddress[autoFillAddress.length - 3].value);
      setState(autoFillAddress[autoFillAddress.length - 2].value);
      setAddress(
        autoFillAddress[autoFillAddress.length - 5].value +
          " " +
          autoFillAddress[autoFillAddress.length - 4].value
      );
    }
  };

  let dateContent;

  dateContent = (
    <FormControl className={classes.testField}>
      <label for="deliveryScheduledFirstDate">
        Scheduled delivery date{" "}
      </label>
      <TextField
        id="deliveryScheduledFirstDate"
        defaultValue=""
        required
        type="date"
        value={scheduledDeliveryDate}
        onChange={(e) => setScheduledDeliveryDate(e.target.value)}
        margin="dense"
        name="deliveryScheduledFirstDate"
        variant="outlined"
        InputProps={{ classes: { input: classes.input } }}
      />
    </FormControl>
  );

  if (props.pickup) {
    dateContent = (
      <FormControl className={classes.testField}>
        <label for="pickupScheduledFirstDate">Scheduled pickup date </label>
        <TextField
          id="pickupScheduledFirstDate"
          defaultValue=""
          required
          type="date"
          value={scheduledPickupDate}
          onChange={(e) => setScheduledPickupDate(e.target.value)}
          margin="dense"
          name="pickupScheduledFirstDate"
          variant="outlined"
          InputProps={{ classes: { input: classes.input } }}
        />
      </FormControl>
    );
  }

  let dialogContent = (
    <div>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <FormControl className={classes.testField}>
                <label for="businessName">Business name</label>
                <TextField
                  id="businessName"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  margin="dense"
                  name="businessName"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
              {
                <FormControl className={classes.testField}>
                  <label for="address">Address</label>
                  <AutoCompleteAddress
                    autoCompleteHandlerComponent={autoCompleteHandlerComponent}
                    address={address}
                  />
                </FormControl>
              }
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.testField}>
                <label for="city">City</label>
                <TextField
                  id="city"
                  defaultValue=""
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  margin="dense"
                  name="city"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
              <FormControl className={classes.testField}>
                <label for="state">State</label>
                <TextField
                  id="state"
                  defaultValue=""
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  margin="dense"
                  name="state"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.testField}>
                <label for="zip">ZIP</label>
                <TextField
                  id="zip"
                  defaultValue=""
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  margin="dense"
                  name="zip"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
              {dateContent}
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.testField}>
                <label for="contactName">Contact name</label>
                <TextField
                  id="contactName"
                  defaultValue=""
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  margin="dense"
                  name="contactName"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
              <FormControl className={classes.testField}>
                <label for="email">Email</label>
                <TextField
                  id="email"
                  defaultValue=""
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="dense"
                  name="email"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.testField}>
                <label for="phone">Phone</label>
                <TextField
                  id="phone"
                  defaultValue=""
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  margin="dense"
                  name="phone"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
              <FormControl className={classes.testField}>
                <label for="fax">Fax</label>
                <TextField
                  id="fax"
                  defaultValue=""
                  required
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  margin="dense"
                  name="fax"
                  variant="outlined"
                  InputProps={{ classes: { input: classes.input } }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={saveChangesUpdateOrderHandler}
          color="primary"
        >
          Save changes
        </Button>
      </DialogActions>
    </div>
  );
  if (
    (props.pickup && props.orderData.orderStatus === loadStatus.DELIVERED) ||
    (props.pickup && props.orderData.orderStatus === loadStatus.PAID) ||
    (props.pickup && props.orderData.orderStatus === loadStatus.PICKED)
  ) {
    dialogContent = (
      <DialogContent dividers>
        <h3>You can not modify address after pickup</h3>
      </DialogContent>
    );
  }

  if (
    (!props.pickup && props.orderData.orderStatus === loadStatus.DELIVERED) ||
    (!props.pickup && props.orderData.orderStatus === loadStatus.PAID)
  ) {
    dialogContent = (
      <DialogContent dividers>
        <h3>You can not modify address after delivery</h3>
      </DialogContent>
    );
  }

  return (
    <div>
      <Dialog
        onClose={props.closePickupEditDialog || props.closeDeliveryEditDialog}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={props.closePickupEditDialog || props.closeDeliveryEditDialog}
        >
          {props.pickup ? " Edit Pickup Location" : "Edit Delivery Location"}
        </DialogTitle>
        {dialogContent}
      </Dialog>
    </div>
  );
}
