import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import NavBar from "../../../components/NavBar"
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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import {withAuth} from "../../../utils/withAuth"

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

 function orderDetails(props) {
  const classes = useStyles();
  const router = useRouter();

  const [orderId, setOrderId] = useState("");
  const [carrierId, setCarrierId] = useState("");
  const [orderData, setOrderData] = useState("");
  const [drivers, setDrivers] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [emailForBol, setEmailForBol] = useState("info@azbsupply.com");
  const [readyToReload, setReadyToReload] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const openEditOrderDialogHandler = () => {
    setOpenEditDialog(true);
  };

  const closeEditOrderDialogHandler = () => {
    setOpenEditDialog(false);
    reloadHandler();
  };

  useEffect(() => {
    setOrderId(router.query.id);
    setCarrierId(props.carrierId)
    const result = async () => {
      const resultDrivers = await axios.post("/api/drivers", {carrierId: props.carrierId});
      setDrivers(resultDrivers.data);
    };
    result();
  },[]);


  useEffect(() => {
    if (orderId && carrierId) {
      const result = async () => {
        const respond = await axios.post("/api/orders/order-details", {
          orderId,
          carrierId,
          userId: props.userId,
          token: props.token
        });
        setOrderData(respond.data);
      };
      result();
    }
  }, [orderId, carrierId]);

  useEffect(() => {

    const result = async () => {
      const respond = await axios.post("/api/orders/order-details", {
        orderId,
        carrierId,
        userId: props.userId,
        token: props.token
      });
      setOrderData(respond.data);
    };
    result();
  }, [readyToReload]);

  //Handlers

  const reloadHandler = () => {
    setReadyToReload(!readyToReload);
  };
  // send bol button handler
  const sendBolHandler = async () => {
    if(orderData.data.orderStatus === "New" || orderData.data.orderStatus === "Assigned"  ){
      return
    }
    await axios.post("/api/bol/send-bol", {
      orderId,
      email: emailForBol,
      carrierId: props.carrierId,
      orderShipperInnerId: orderData.data.shipperOrderId,
      userId: props.userId,
      token: props.token
    });
  };

  // send invoice button handler
  const sendInvoiceHandler = async () => {
    if(orderData.data.orderStatus === "New" || orderData.data.orderStatus === "Assigned"  ){
      return
    }
    await axios.post("/api/bol/send-invoice", {
      orderId,
      email: emailForBol,
      carrierId: props.carrierId,
      orderShipperInnerId: orderData.data.shipperOrderId,
    });
  };

  //mark order as paid
  const paidOrderHandler = async () => {
    if (orderData.data.orderStatus === "Delivered") {
      await axios.post("/api/orders/order-paid", {
        carrierId: props.carrierId,
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
      carrierId: props.carrierId,
      orderId,
    });
    reloadHandler();
  };

  // archive order
  const archiveOrderHandler = async () => {
    await axios.post("/api/orders/order-archive", {
      carrierId: props.carrierId,
      orderId,
    });
    reloadHandler();
  };

  //Assign Driver Dialog
  const assignButtonAndDialog = (
    <AssignDriverDialog
      carrierId={props.carrierId}
      drivers={drivers}
      orderStatus={orderData.data?.orderStatus}
      order_id={orderId}
      shipperOrderId={orderData.data?.shipperOrderId}
      order_assigned_driver={
        orderData.data?.roles?.driverId !== ""
          ? orderData.data?.usersNames.driverName
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

  const photoPickupContent = (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={"https://via.placeholder.com/150"}
          title="Load photo"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Photos are unavailable yet
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
  const photoDeliveryContent = (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={"https://via.placeholder.com/150"}
          title="Load photo"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Photos are unavailable yet
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  if (orderData.data.pickup.pickup_conditions?.pickup_inspection_images_links) {
    const photoPickupContent = orderData.data.pickup.pickup_conditions?.pickup_inspection_images_links.map(
      (photo, index) => (
        <Card className={classes.root} key={index}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={photo}
              title="Load photo"
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                1972 Ford Mustang
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )
    );
  }

  if (
    orderData.data.delivery.delivery_conditions
      ?.delivery_inspection_images_links
  ) {
    const photoDeliveryContent = orderData.data.delivery.delivery_conditions?.delivery_inspection_images_links.map(
      (photo, index) => (
        <Card className={classes.root} key={index}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={photo}
              title="Load photo"
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                1972 Ford Mustang
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )
    );
  }

  const appBarContent = (
    <AppBar position="fixed" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.upperToolBar}>
        <Grid container>
          <Grid item xs={2}>
            <Typography variant="h6" noWrap>
              Load # {orderData.data.shipperOrderId}
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar className={classes.upperToolBar}>
        <Grid container>
          <Grid item xs={2}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              {(orderData.data.orderStatus === "New" ||
                orderData.data.orderStatus === "Assigned") && (
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
              {orderData.data.orderStatus === "Paid" && (
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
              <Button
                size="small"
                className={classes.button}
                onClick={sendBolHandler}
                
              >
                Send BOL
              </Button>
              <Button
                size="small"
                className={classes.button}
                onClick={sendInvoiceHandler}
              >
                Send invoice
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={2}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              {orderData.data.orderStatus === "Delivered" && (
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
                        {orderData.data.orderStatus}
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
                        {orderData.data.shipper.businessName}
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
                            Phones
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            <ArrowUpwardIcon />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupScheduledFirstDate}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupAddress.businessName}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupAddress.address}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupAddress.city}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupAddress.state}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupAddress.zip}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.pickup.pickupAddress.contact_name}
                          </TableCell>

                          <TableCell className={classes.tableCell}>
                            <Grid container spacing={1}>
                              {orderData.data.pickup.pickupAddress.phones.map(
                                (phone, index) => (
                                  <Grid item xs={12} key={index}>
                                    {phone}
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableCell}>
                            <ArrowDownwardIcon />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {
                              orderData.data.delivery
                                .deliveryScheduledFirstDate
                            }
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {
                              orderData.data.delivery.deliveryAddress
                                .businessName
                            }
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.deliveryAddress.address}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.deliveryAddress.city}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.deliveryAddress.state}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.delivery.deliveryAddress.zip}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {
                              orderData.data.delivery.deliveryAddress
                                .contact_name
                            }
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            <Grid container spacing={1}>
                              {orderData.data.delivery.deliveryAddress.phones.map(
                                (phone, index) => (
                                  <Grid item xs={12} key={index}>
                                    {phone}
                                  </Grid>
                                )
                              )}
                            </Grid>
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
                            ${orderData.data.orderPayment.orderAmount}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.orderPayment.paymentMethod}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.orderPayment.paymentTerms}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {orderData.data.orderPayment.paymentUpon}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            ${orderData.data.orderPayment.driverPay}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            ${orderData.data.orderPayment.brokerFee}
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
                        {orderData.data.orderInstructions
                          ? orderData.data.orderInstructions
                          : "No instructions were received"}
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
                        {photoPickupContent}
                        {photoDeliveryContent}
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
                      <Button
                        size="small"
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                      >
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
                    {orderData.data.orderActivity.map((activity, index) => (
                      <Box fontSize="body2.fontSize" m={2} key={index}>
                        <Card>
                          <CardContent>
                            <List
                              component="nav"
                              aria-label="main mailbox folders"
                            >
                              <ListItem>
                                <ListItemIcon>
                                  <BookmarkBorderIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${activity.activityStatus}`}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <DateRangeIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${activity.activityDate}`}
                                />
                              </ListItem>
                              {activity.activity_location && (
                                <ListItem>
                                  <ListItemIcon>
                                    <RoomIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={`${activity.activity_location}`}
                                  />
                                </ListItem>
                              )}

                              <ListItem>
                                <ListItemIcon>
                                  <PersonIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${activity.activityUser}`}
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
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
      <NavBar>
      {appBarContent}

      <Grid container spacing={2}>
        <Grid item container md={9} xs={12}>
          {leftSideContent}
        </Grid>
        <Grid item container md={3} xs={12}>
          {rightSideContent}
        </Grid>
      </Grid>
      {editOrderDialog}
      </NavBar>
    </div>
  );
}

export default withAuth(orderDetails)