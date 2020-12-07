import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CheckIcon from "@material-ui/icons/Check";
import RoomIcon from "@material-ui/icons/Room";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import PersonIcon from "@material-ui/icons/Person";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

//dialogs
import AssignDriverDialog from "../../../components/order/dialogs/AssignDriverDialog";
import EditOrder from "../edit-order";

const drawerWidth = 120;
const TableCellActivity = withStyles({
  root: {
    borderBottom: "none",
  },
})(TableCell);

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
  root: {
    maxWidth: 345,
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginTop: 0,
    border: 2,
  },
  appBarModal: {
    position: "relative",
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
  media: {
    height: 140,
  },
  editButton: {
    color: "red",
    fontSize: 11,
  },
  button: {
    fontSize: 11,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function orderDetails() {
  const classes = useStyles();
  const router = useRouter();

  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState("");
  const [drivers, setDrivers] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [readyToReload, setReadyToReload] = useState("");
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const openEditOrderDialogHandler = () => {
    setOpenEditDialog(true);
  };

  const closeEditOrderDialogHandler = () => {
    setOpenEditDialog(false);
    reloadHandler();
  };

  useEffect(() => {
    setOrderId(router.query.id);
  });

  useEffect(() => {
    const result = async () => {
      const resultDrivers = await axios.get("/api/drivers");
      setDrivers(resultDrivers.data);
    };
    result();
  }, []);

  useEffect(() => {
    if (orderId) {
      let orderId = router.query.id;
      const result = async () => {
        const respond = await axios.post("/api/orders/order-details", {
          orderId,
        });
        setOrderData(respond.data);
      };
      result();
    }
  }, [orderId]);

  useEffect(() => {
    let orderId = router.query.id;
    const result = async () => {
      const respond = await axios.post("/api/orders/order-details", {
        orderId,
      });
      setOrderData(respond.data);
    };
    result();
  }, [readyToReload]);

  //Handlers

  const reloadHandler = () => {
    setReadyToReload(!readyToReload);
  };

  //mark order as paid
  const paidOrderHandler = async () => {
    if (orderData.data.order_status === "Delivered") {
      await axios.post("/api/orders/order-paid", {
        carrierId: "1840b8a5-3381-41f7-9838-8ad23a7b50bd",
        orderId,
      });
      reloadHandler();
    } else {
      alert("You can mark as paid only after delivery");
    }
  };
  //cancel order
  const cancelOrderHandler = async () => {
    await axios.post("/api/orders/order-cancel", {
      carrierId: "1840b8a5-3381-41f7-9838-8ad23a7b50bd",
      orderId,
    });
    reloadHandler();
  };

  // archive order
  const archiveOrderHandler = async () => {
    await axios.post("/api/orders/order-archive", {
      carrierId: "1840b8a5-3381-41f7-9838-8ad23a7b50bd",
      orderId,
    });
    reloadHandler();
  };

  //Assign Driver Dialog
  const assignButtonAndDialog = (
    <AssignDriverDialog
      carrier_id={"1840b8a5-3381-41f7-9838-8ad23a7b50bd"}
      drivers={drivers}
      order_status={orderData.data?.order_status}
      order_id={orderId}
      order_shipper_inner_id={orderData.data?.order_shipper_inner_id}
      order_assigned_driver={
        orderData.data?.roles?.driver_system_id !== ""
          ? orderData.data?.users_names.driver_name
          : "Not assigned"
      }
      reloadHandler={reloadHandler}
    />
  );

  const editOrderDialog = (
    <div>
      <Dialog
        fullScreen
        open={openEditDialog}
        onClose={closeEditOrderDialogHandler}
        TransitionComponent={Transition}
      >
        <Container>
          <EditOrder
            orderData={orderData}
            orderId={orderId}
            closeDialogHandler={closeEditOrderDialogHandler}
          />
        </Container>
      </Dialog>
    </div>
  );

  if (!orderData) {
    return null;
  }

  //page content

  const appBarContent = (
    <AppBar position="fixed" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.upperToolBar}>
        <Grid container>
          <Grid item xs={2}>
            <Typography variant="h6" noWrap>
              Load # {orderData.data.order_shipper_inner_id}
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar className={classes.upperToolBar}>
        <Grid container>
          <Grid item xs={2}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              {(orderData.data.order_status === "New" ||
                orderData.data.order_status === "Assigned") && (
                <Button
                  onClick={cancelOrderHandler}
                  size="small"
                  className={classes.button}
                >
                  Cancel
                </Button>
              )}
              <Button
                classes={{ root: classes.editButton }}
                size="small"
                className={classes.button}
                onClick={openEditOrderDialogHandler}
              >
                Edit
              </Button>
              {orderData.data.order_status === "Paid" && (
                <Button
                  onClick={archiveOrderHandler}
                  size="small"
                  className={classes.button}
                >
                  Archive
                </Button>
              )}
            </ButtonGroup>
          </Grid>
          <Grid item xs={2}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button size="small" className={classes.button}>
                Send BOL
              </Button>
              <Button size="small" className={classes.button}>
                Send invoice
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={2}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              {orderData.data.order_status === "Delivered" && (
                <Button onClick={paidOrderHandler} size="small">
                  Payment received
                </Button>
              )}
            </ButtonGroup>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar className={classes.upperToolBar}>
        <Grid container>
          <Grid item xs={2}>
            {assignButtonAndDialog}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );

  const leftSideContent = (
    <Box ml={2} mt={2}>
      <Grid container spacing={2} className={classes.container}>
        <Grid id="row_1" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Status
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="subtitle2.fontSize" m={2}>
                        {orderData.data.order_status}
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid id="column_2" item container xs={10}>
                  <Grid item xs={2}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Shipper:
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2}>
                        {orderData.data.shipper.business_name}
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item container xs={12}>
                    <Grid item xs={5}>
                      <Typography>
                        <Box fontSize="subtitle2.fontSize" m={2}>
                          {orderData.data.shipper.address}
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>
                        <Box fontSize="subtitle2.fontSize" m={2}>
                          {orderData.data.shipper.contact_name}
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>
                        <Box fontSize="subtitle2.fontSize" m={2}>
                          {orderData.data.shipper.phone}
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <Box fontSize="subtitle2.fontSize" m={2}>
                          {orderData.data.shipper.email}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid id="row_2" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Vehicles
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_2" item container xs={12}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-label="vehicle input table"
                    >
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
                        {orderData.data.vehiclesArray.map((vehicle, index) => (
                          <TableRow key={index}>
                            <TableCell
                              className={classes.tableCell}
                              width="20%"
                            >
                              {vehicle.vin}
                            </TableCell>
                            <TableCell className={classes.tableCell} width="8%">
                              {vehicle.year}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              width="20%"
                            >
                              {vehicle.make}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              width="20%"
                            >
                              {vehicle.model}
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              width="10%"
                            >
                              {vehicle.lotNumber} #
                            </TableCell>
                            <TableCell
                              className={classes.tableCell}
                              width="10%"
                            >
                              {vehicle.type}
                            </TableCell>
                            <TableCell className={classes.tableCell} width="5%">
                              {vehicle.inoperable ? <CheckIcon /> : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid id="row_3" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Locations
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_2" item container xs={12}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-label="vehicle input table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableCell}></TableCell>
                          <TableCell className={classes.tableCell}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Business name
                          </TableCell>

                          <TableCell className={classes.tableCell}>
                            Address
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            City
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            State
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            ZIP
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Contact
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Phone
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            <ArrowUpwardIcon />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_scheduled_first_date}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.business_name}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.address}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.city}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.state}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.zip}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.contact_name}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickup_address.phone}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            <ArrowDownwardIcon />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {
                              orderData.data.delivery
                                .delivery_scheduled_first_date
                            }
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {
                              orderData.data.delivery.delivery_address
                                .business_name
                            }
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.delivery_address.address}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.delivery_address.city}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.delivery_address.state}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.delivery_address.zip}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {
                              orderData.data.delivery.delivery_address
                                .contact_name
                            }
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.delivery_address.phone}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid id="row_5" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Payment
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_2" item container xs={12}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-label="vehicle input table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            Price
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Method
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Terms
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Start upon
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Driver pay
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            Broker fee
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            ${orderData.data.order_payment.order_total_amount}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.order_payment.payment_method}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.order_payment.payment_terms}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.order_payment.payment_upon}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            ${orderData.data.order_payment.driver_pay}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            ${orderData.data.order_payment.broker_fee}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid id="subrow_2" item container xs={12}>
                <Grid id="column_2" item container xs={12}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        On Delivery to Carrier: $600.00 *COD Company** owes
                        Carrier: $0.00 after COD is paid *Cash/Certified Funds
                        on Delivery.
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid id="row_6" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Instructions
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_2" item container xs={12}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        DISPATCH INSTRUCTIONS Call or Text Cody for Dispatch @
                        608-370-3583 This must be picked up exactly on
                        12/06/2020. This should be delivered within 2 days of
                        12/16/2020. CONTRACT TERMS ***PLEASE READ CAREFULLY***
                        ** YOU MUST READ BEFORE YOU ACCEPT. WE TAKE OUR
                        DISCOUNTING SERIOUSLY FOR LATENESS AND WILL NOTIFY
                        CUSTOMER FOR DISCOUNTED RATE IF YOU ARE LATE. THIS
                        CONTRACT SUPERSEDES ANY AND ALL PREVIOUS AGREEMENTS OR
                        REPRESENTATIONS MADE BY ANY OF BROKER'S
                        REPRESENTATIVES.** BY ACCEPTING THIS ORDER YOU AGREE TO
                        ALL OF THE TERMS LISTED BELOW. IT IS UNDERSTOOD THAT
                        ACCEPTING OF THIS PARTICULAR ORDER, YOU ARE MANIFESTING
                        ASSENT TO ALL TERMS OF THIS AGREEMENT. THE EFFECTIVE
                        DATE OF THIS AGREEMENT SHALL BE THE DATE ON WHICH THE
                        ORDER IS ACCEPTED. This agreement is between Maresca's
                        Auto Transport hereinafter referred to as "broker") MC
                        #1095343 and ______________________________ located at
                        _______________________________________ , (hereinafter
                        referred to as "transporter"). This agreement beginning
                        and effective this _day of ____, 20__. This agreement is
                        valid for one year to this date and automatically renews
                        each year on the anniversary date of this agreement.
                        Either party may cancel this agreement via written
                        notice once no shipment is in transporter's possession.
                        Terms 1. No re-brokering of any vehicle. 2. Any load
                        dispatched to Transporter must be picked up and
                        delivered by Transporter. If Transporter is unable to
                        complete a load due to breakdown, out of service, etc,
                        Transporter must immediately notify Broker. Leaving a
                        message is not acceptable notification. Once notified of
                        delays, Broker has sole discretion to dispatch load to
                        another Transporter for completion. If load is
                        dispatched to another Transporter, original Transporter
                        will be paid only for the portion of the trip completed.
                        3. Transporter agrees to be responsible for all damages
                        during loading, unloading and transporting. This
                        includes, but is not limited to: glass, antennas,
                        radios, interiors, rims, convertible tops, and truck
                        caps. Damages caused by truck equipment failure,
                        including chain and tie-down failure, are the
                        Transporter's responsibility. 4. Vehicles picked up at
                        an auction must have damages noted on the GATE PASS. A
                        guard's signature, pictures, and/or damages noted on
                        Transporter's condition report are NOT a substitute for
                        this requirement. In case of a discrepancy concerning
                        damages, ONLY what is noted on the gate pass will be
                        deemed not the Transporter's responsibility. Weather,
                        lack of light, dirt on the vehicle, and/or lack of a pen
                        are not acceptable reasons for not writing damages on
                        the gate pass. 5. Vehicles picked up at a customer's
                        location must have a condition report completed and
                        signed by customer before vehicles are loaded. A copy of
                        the condition report must be left with the customer. If
                        there is a discrepancy, the customer's copy will be used
                        to determine pre-existing damage. 6. A customer's
                        signature on a delivery receipt indicates ONLY that
                        customer has received the shipment. That is why we ask
                        you deliver during daylight hours or in a well lit area.
                        7. Carrier agrees to abide by pick-up and delivery dates
                        as specified on dispatch sheet. If Transporter is unable
                        to meet pick-up and delivery dates, Broker must be
                        notified immediately. Transporter must contact Broker by
                        phone and either communicate the reason for
                        Transporter's inability to meet their obligation; or if
                        Broker is unavailable, leave a detailed message with the
                        Transporter's name, telephone number, the order number
                        for the load, the estimated time of arrival and a
                        detailed summary regarding Transporter's inability to
                        meet their obligation. Broker has sole discretion after
                        notification of late pick-up or delivery to re-assign
                        load. If Broker is not notified of late
                        pick-up/delivery, Transporter agrees to have $50/day per
                        vehicle penalty deducted from shipment price. 8. Any
                        vehicle cannot be transferred to another transporter
                        without express permission by Broker. Transporter agrees
                        to notify Broker BEFORE LEAVING point of origin if
                        Transporter is unable to load all vehicles together.
                        Failure to load dispatched vehicle will result in a rate
                        reduction or a $100 penalty payable to Broker. Broker
                        has sole discretion to re- assign the entire load if
                        Transporter is unable to take all vehicles dispatched.
                        9. The Transporter agrees not to directly solicit
                        freight or any transport-related business from Broker's
                        customers that it hauled for Broker for a period of one
                        year after termination of this agreement. Should the
                        Transporter solicit the Broker's customers and obtain
                        freight or any transport-related business from the
                        Broker's customer, the Transporter agrees to pay Broker,
                        for a period of 15 months after obtaining business from
                        Broker's customer, a commission totaling 20% of the
                        gross monies received from said customers, payable by
                        Transporter immediately upon receipt. 10.
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid id="row_7" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Notes
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_2" item container xs={12}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        Some notes
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid id="row_8" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Photos
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_2" item container xs={10}>
                  <Grid item xs={3}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        <Card className={classes.root}>
                          <CardActionArea>
                            <CardMedia
                              className={classes.media}
                              image="https://i.pinimg.com/originals/9e/3a/1c/9e3a1cfb7a471a1ad5904e93ebe8e260.jpg"
                              title="Contemplative Reptile"
                            />
                            <CardContent>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                1972 Ford Mustang
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        <Card className={classes.root}>
                          <CardActionArea>
                            <CardMedia
                              className={classes.media}
                              image="https://i.pinimg.com/originals/9e/3a/1c/9e3a1cfb7a471a1ad5904e93ebe8e260.jpg"
                              title="Contemplative Reptile"
                            />
                            <CardContent>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                1972 Ford Mustang
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        <Card className={classes.root}>
                          <CardActionArea>
                            <CardMedia
                              className={classes.media}
                              image="https://i.pinimg.com/originals/9e/3a/1c/9e3a1cfb7a471a1ad5904e93ebe8e260.jpg"
                              title="Contemplative Reptile"
                            />
                            <CardContent>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                1972 Ford Mustang
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <Box fontSize="body2.fontSize" m={2}>
                        <Card className={classes.root}>
                          <CardActionArea>
                            <CardMedia
                              className={classes.media}
                              image="https://i.pinimg.com/originals/9e/3a/1c/9e3a1cfb7a471a1ad5904e93ebe8e260.jpg"
                              title="Contemplative Reptile"
                            />
                            <CardContent>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                1972 Ford Mustang
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  const rightSideContent = (
    <Box ml={2} mt={2}>
      <Grid container spacing={2} className={classes.container}>
        <Grid id="row_1" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={6}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Message center
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid id="column_1" item container xs={6}>
                  <Grid item xs={12}>
                    <Box fontSize="h6.fontSize" m={2} color="primary.main">
                      <Button size="small" className={classes.button} variant="outlined" color="primary">
                        Send
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid id="subrow_1" item container xs={12}>
                <Grid id="column_1" item container xs={12}>
                  <Grid item xs={12}>
                    <Box fontSize="body2.fontSize" m={2}>
                      <TextField
                        id="standard-multiline-static"
                        label="Text message to driver"
                        multiline
                        rowsMax={4}
                        margin="dense"
                        InputProps={{
                          classes: { input: classes.inputText },
                        }}
                        fullWidth={true}
                        value={messageContent}
                        onChange={(e) => {
                          setMessageContent(e.target.value);
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid id="row_2" item container xs={12} direction="row">
          <Grid item xs={12}>
            <Paper elevation={0} variant="outlined">
              <Grid id="subrow_0" item container xs={12}>
                <Grid id="column_1" item container xs={12}>
                  <Grid item xs={12}>
                    <Typography>
                      <Box fontSize="h6.fontSize" m={2} color="primary.main">
                        Activity
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid id="column_1" item container xs={12}>
                  <Grid item xs={12}>
                    <Box fontSize="body2.fontSize" m={2}>
                      <Card>
                        <CardContent>
                          <TableContainer>
                            <Table
                              className={classes.table}
                              aria-label="simple table"
                              dense
                              table
                              size="small"
                            >
                              <TableBody>
                                <TableRow>
                                  <TableCellActivity>
                                    <BookmarkBorderIcon />
                                  </TableCellActivity>
                                  <TableCellActivity>
                                    Delivered
                                  </TableCellActivity>
                                </TableRow>
                                <TableRow>
                                  <TableCellActivity>
                                    <DateRangeIcon />
                                  </TableCellActivity>
                                  <TableCellActivity>
                                    12/12/2020
                                  </TableCellActivity>
                                </TableRow>
                                <TableRow>
                                  <TableCellActivity>
                                    <RoomIcon />
                                  </TableCellActivity>
                                  <TableCellActivity>
                                    4662 67th Av N, Pinellas Park
                                  </TableCellActivity>
                                </TableRow>

                                <TableRow>
                                  <TableCellActivity>
                                    <PersonIcon />
                                  </TableCellActivity>
                                  <TableCellActivity>
                                    By Bazyl Zholymbet
                                  </TableCellActivity>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div>
      {appBarContent}

      <Grid container spacing>
        <Grid item container md={9} xs={12}>
          {leftSideContent}
        </Grid>
        <Grid item container md={3} xs={12}>
          {rightSideContent}
        </Grid>
      </Grid>
      {editOrderDialog}
    </div>
  );
}
