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
      setBusinessName(props.orderData.pickup.pickup_address.business_name);
      setAddress(props.orderData.pickup.pickup_address.address);
      setCity(props.orderData.pickup.pickup_address.city);
      setState(props.orderData.pickup.pickup_address.state);
      setZip(props.orderData.pickup.pickup_address.zip);
      setScheduledPickupDate(
        props.orderData.pickup.pickup_scheduled_first_date
      );
      setScheduledDeliveryDate(
        props.orderData.delivery.delivery_scheduled_first_date
      );
      setPickupNotes(props.orderData.pickup.pickup_additional_notes);
      setContactName(props.orderData.pickup.pickup_address.contact_name);
      setEmail(props.orderData.pickup.pickup_address.email);
      setPhone(props.orderData.pickup.pickup_address.phone);
      setFax(props.orderData.pickup.pickup_address.fax);
    }
    if (!props.pickup) {
      setBusinessName(props.orderData.delivery.delivery_address.business_name);
      setAddress(props.orderData.delivery.delivery_address.address);
      setCity(props.orderData.delivery.delivery_address.city);
      setState(props.orderData.delivery.delivery_address.state);
      setZip(props.orderData.delivery.delivery_address.zip);
      setScheduledPickupDate(
        props.orderData.delivery.delivery_scheduled_first_date
      );
      setScheduledDeliveryDate(
        props.orderData.delivery.delivery_scheduled_first_date
      );
      setPickupNotes(props.orderData.delivery.delivery_additional_notes);
      setContactName(props.orderData.delivery.delivery_address.contact_name);
      setEmail(props.orderData.delivery.delivery_address.email);
      setPhone(props.orderData.delivery.delivery_address.phone);
      setFax(props.orderData.delivery.delivery_address.fax);
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
      <label for="delivery_scheduled_first_date">
        Scheduled delivery date{" "}
      </label>
      <TextField
        id="delivery_scheduled_first_date"
        defaultValue=""
        required
        type="date"
        value={scheduledDeliveryDate}
        onChange={(e) => setScheduledDeliveryDate(e.target.value)}
        margin="dense"
        name="delivery_scheduled_first_date"
        variant="outlined"
        InputProps={{ classes: { input: classes.input } }}
      />
    </FormControl>
  );

  if (props.pickup) {
    dateContent = (
      <FormControl className={classes.testField}>
        <label for="pickup_scheduled_first_date">Scheduled pickup date </label>
        <TextField
          id="pickup_scheduled_first_date"
          defaultValue=""
          required
          type="date"
          value={scheduledPickupDate}
          onChange={(e) => setScheduledPickupDate(e.target.value)}
          margin="dense"
          name="pickup_scheduled_first_date"
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
                <label for="business_name">Business name</label>
                <TextField
                  id="business_name"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  margin="dense"
                  name="business_name"
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
                <label for="contact_name">Contact name</label>
                <TextField
                  id="contact_name"
                  defaultValue=""
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  margin="dense"
                  name="contact_name"
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
    (props.pickup && props.orderData.order_status === "Delivered") ||
    (props.pickup && props.orderData.order_status === "Paid") ||
    (props.pickup && props.orderData.order_status === "Picked")
  ) {
    dialogContent = (
      <DialogContent dividers>
        <h3>You can not modify address after pickup</h3>
      </DialogContent>
    );
  }

  if (
    (!props.pickup && props.orderData.order_status === "Delivered") ||
    (!props.pickup && props.orderData.order_status === "Paid")
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
