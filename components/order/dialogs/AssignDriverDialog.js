import React, {  useState } from "react";
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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";

import { loadStatus } from "../../../utils/status"

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  button: {
    fontSize: 11,
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function AssignDriverDialog(props) {
  const classes = useStyles();
  const [openAssignDriverDialog, setOpenAssignDriverDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedDriverData, setSelectedDriverData] = useState("");

  const driverSelectHandler = (event) => {
    setSelectedDriver(event.target.value);
    const driverData = props.drivers.find((driver) => {
      return driver.id === event.target.value;
    });
    setSelectedDriverData(driverData);
  };

  const assignDriverhandleClickOpen = () => {
    setOpenAssignDriverDialog(true);
  };

  const dialogCloseHandler = () => {
    setOpenAssignDriverDialog(false);
  };

  //assign driver to order
  const assignDriverihandleClose = async () => {
    const respond = await axios.post("/api/orders/assign-driver", {
      carrierId: props.carrierId,
      orderId: props.order_id,
      driverId: selectedDriver,
      shipperOrderId: props.shipperOrderId,
      driverName:
        selectedDriverData.data.firstName +
        " " +
        selectedDriverData.data.lastName,
    });
    setOpenAssignDriverDialog(false);
    props.reloadHandler();
  };

  //unnassign driver
  const unAssignDriverFromOrderHandler = async () => {
    const respond = await axios.post("/api/orders/unassign-driver", {
      carrierId: props.carrierId,
      orderId: props.order_id,
      shipperOrderId: props.shipperOrderId,
      driverName: props.order_assigned_driver,
    });
    setOpenAssignDriverDialog(false);
    props.reloadHandler();
  };

  if (!props.drivers) {
    return <h1>Loading</h1>;
  }

  return (
    <div>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={assignDriverhandleClickOpen}
        size="small"
        disabled={
          props.orderStatus === loadStatus.DELIVERED || props.orderStatus === loadStatus.PAID
        }
      >
        {props.orderStatus === loadStatus.NEW
          ? "Assign"
          : "Driver: " + props.order_assigned_driver}
      </Button>
      <Dialog
        onClose={dialogCloseHandler}
        aria-labelledby="customized-dialog-title"
        open={openAssignDriverDialog}
        maxWidth="xs"
      >
        <DialogTitle id="customized-dialog-title" onClose={dialogCloseHandler}>
          {props.order_assigned_driver === "Not assigned" ? "Assign a driver" : "Reassign the driver" }
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <label for="type">Select driver</label>
                <Select
                  id="driver"
                  margin="dense"
                  name="driver"
                  value={selectedDriver}
                  onChange={driverSelectHandler}
                >
                  {props.drivers.map((driver) => (  
                    <MenuItem value={driver.id} key={driver.id}>
                      {driver.data.firstName + " " + driver.data.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {props.orderStatus === loadStatus.ASSIGNED ? (
                <Button onClick={unAssignDriverFromOrderHandler}>
                  Unnassign driver
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={assignDriverihandleClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
