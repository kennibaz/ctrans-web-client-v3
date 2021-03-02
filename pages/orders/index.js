import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head"
import NavBar from "../../components/NavBar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";

import OrderCard from "../../components/order/orderCard";

//import utils
import { withAuth } from "../../utils/withAuth";
import {loadStatus} from "../../utils/status"
import { Order } from "../../components/models/order";

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
  tabBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginTop: 200,
  },
  upperToolBar: {
    color: "black",
    background: "white",
  },
  middleToolBar: {
    color: "black",
    background: "white",
  },
  lowerToolBar: {
    color: "black",
    background: "white",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
  },
  inputText: {
    fontSize: 12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectLabel: {
    marginBottom: 5,
    paddingBottom: 5,
  },
}));

function orders(props) {
  const classes = useStyles();

  const [orders, setOrders] = useState([]);
  const [ordersForSearch, setOrdersForSearch] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(false);

  const [statusAll, setStatusAll] = useState(true);
  const [statusNew, setStatusNew] = useState(false);
  const [statusAssigned, setStatusAssigned] = useState(false);
  const [statusPicked, setStatusPicked] = useState(false);
  const [statusDelivered, setStatusDelivered] = useState(false);
  const [statusPaid, setStatusPaid] = useState(false);
  const [readyToUpdateOrders, setReadyToUpdateOrders] = useState(false);
  const [readyToReload, setReadyToReload] = useState(false);

  // const ordersArray = [] TODO later when switched to class
 
  
//get initial order list
  useEffect(() => {
    const request = async () => {
      if (props.carrierId) {
        const resultOrders = await axios.post("/api/orders", {
          carrierId: props.carrierId,
          statusAll: true,
          userId: props.userId,
          token: props.token,
        });
        const resultDrivers = await axios.post("/api/drivers", {
          carrierId: props.carrierId,
        });
        setOrders(resultOrders.data);
        setOrdersForSearch(resultOrders.data);
        setDrivers(resultDrivers.data);
        // instantiateOrders(resultOrders.data) TODO later on
      }
    };
    request();
  }, [readyToReload, props.carrierId]);


  //Get orders from Server when tab was changed
  useEffect(() => {
    if (readyToUpdateOrders) {
      if (
        !statusNew &&
        !statusAssigned &&
        !statusPicked &&
        !statusDelivered &&
        !statusPaid
      ) {
        setStatusAll(true);
        const request = async () => {
          const resultOrders = await axios.post("/api/orders", {
            statusAll: true,
            selectedDriver,
            carrierId: props.carrierId,
            userId: props.userId,
            token: props.token,
          });
          setReadyToUpdateOrders(false);
          setOrders(resultOrders.data);
        };
        request();
        return;
      }

      const request = async () => {
        const resultOrders = await axios.post("/api/orders", {
          statusAll,
          statusNew,
          statusAssigned,
          statusPicked,
          statusDelivered,
          statusPaid,
          selectedDriver,
          carrierId: props.carrierId,
          userId: props.userId,
          token: props.token,
        });

        setReadyToUpdateOrders(false);
        setOrders(resultOrders.data);
      };
      request();
    }
  }, [readyToUpdateOrders]);


  // Make orders TODO later

  // const instantiateOrders = (orderData) => {
  //   orderData.forEach((order) => {
  //     let currentOrder = new Order(
  //       order.id,
  //       order.data.carrierId,
  //       order.data.shipperOrderId
  //     );
  //     ordersArray.push(currentOrder);
  //   });
  //   console.log(ordersArray)
  // };

  //search engine
  const searchHandler = () => {
    let searchToLower = searchWord.toLowerCase();
    const filteredResults = ordersForSearch.filter(
      (order) =>
        order.data.shipperOrderId.toLowerCase().includes(searchToLower) ||
        order.data.shipper.businessName.toLowerCase().includes(searchToLower) ||
        order.data.vehiclesArray.some(
          (vehicle) => vehicle.make.toLowerCase() === searchToLower
        ) ||
        order.data.vehiclesArray.some(
          (vehicle) => vehicle.model.toLowerCase() === searchToLower
        ) ||
        order.data.vehiclesArray.some(
          (vehicle) => vehicle.year.toLowerCase() === searchToLower
        )
    );
    setOrders(filteredResults);
  };
  const clearSearchHandler = () => {
    setSearchWord("");
    setSelectedDriver("");
    setOrders(ordersForSearch);
  };

  const selectedDriverHandler = (e) => {
    setSelectedDriver(e.target.value);
    setReadyToUpdateOrders(true);
  };

  

  // handler to select status of the load to show
  const statusSelectHandler = (status) => {
    switch (status) {
      case loadStatus.NEW:
        setStatusNew(!statusNew);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case loadStatus.ASSIGNED:
        setStatusAssigned(!statusAssigned);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case loadStatus.PICKED:
        setStatusPicked(!statusPicked);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case loadStatus.DELIVERED:
        setStatusDelivered(!statusDelivered);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case loadStatus.PAID:
        setStatusPaid(!statusPaid);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
    }
  };

  //show all loads
  const statusSelectAllHandler = () => {
    setStatusAll(true);
    setStatusNew(false);
    setStatusAssigned(false);
    setStatusPicked(false);
    setStatusDelivered(false);
    setStatusPaid(false);
    setReadyToUpdateOrders(true);
  };

  //reloadHandler
  const reloadHandler = () => {
    setReadyToReload(!readyToReload);
  };

  let orderContent;
  //initial content if orders > 0
  orderContent = (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12}>
        <div className={classes.scrollable}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              orderData={order.data}
              orderId={order.id}
              drivers={drivers}
              carrierId={props.carrierId}
              reloadHandler={reloadHandler}
            />
          ))}
        </div>
      </Grid>
    </Grid>
  );

  //Show spinner if no loads
  if (orders.length === 0) {
    orderContent = (
      <Grid container spacing={2} className={classes.container}>
        <Grid item container xs={12} justify="center" alignItems="center">
          <Grid item xs={2}>
            <Box pt={5}>
              <Typography variant="h4" noWrap>
                No Loads yet
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  //MAIN BODY 
  return (
    <div>
      <Head>
        <title>C|Transporter - Orders</title>
      </Head>
      <NavBar>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <Toolbar className={classes.upperToolBar}>
            <Grid>
              <Typography variant="h6" noWrap>
                ORDERS
              </Typography>
            </Grid>
          </Toolbar>
          <Toolbar className={classes.middleToolBar}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item={4}>
                {" "}
                <TextField
                  id="shipper_id"
                  required
                  placeholder="Vehicle, Order, Shipper"
                  margin="dense"
                  value={searchWord}
                  onChange={(e) => {
                    setSearchWord(e.target.value);
                  }}
                  name="shipper_id"
                  variant="outlined"
                  InputProps={{
                    classes: { input: classes.inputText },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            searchHandler();
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel
                    shrink
                    margin="dense"
                    className={classes.selectLabel}
                  >
                    Filter by drivers
                  </InputLabel>
                  <Select
                    id="type"
                    margin="dense"
                    placeholder="Filter by drivers"
                    name="type"
                    value={selectedDriver}
                    onChange={(e) => {
                      selectedDriverHandler(e);
                    }}
                    style={{ fontSize: 12, width: "200%" }}
                  >
                    {drivers.map((driver) => (
                      <MenuItem value={driver.id} key={driver.id}>
                        {driver.data.firstName + " " + driver.data.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>{" "}
              </Grid>
              <Grid item xs={1}>
                <Button onClick={clearSearchHandler}>CLEAR</Button>
              </Grid>
              <Grid item={3}></Grid>
            </Grid>
          </Toolbar>
          <Toolbar className={classes.lowerToolBar}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={1}>
                <Chip
                  avatar={<Avatar>A</Avatar>}
                  label="All - 32"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectAllHandler();
                  }}
                  variant="outlined"
                  variant={statusAll ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>N</Avatar>}
                  label="New - 12"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler(loadStatus.NEW);
                  }}
                  variant={statusNew ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>A</Avatar>}
                  label="Assigned"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler(loadStatus.ASSIGNED);
                  }}
                  variant={statusAssigned ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>PU</Avatar>}
                  label="Picked up"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler(loadStatus.PICKED);
                  }}
                  variant={statusPicked ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>DL</Avatar>}
                  label="Delivered"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler(loadStatus.DELIVERED);
                  }}
                  variant={statusDelivered ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>P</Avatar>}
                  label="Paid"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler(loadStatus.PAID);
                  }}
                  variant={statusPaid ? "default" : "outlined"}
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {orderContent}
      </NavBar>
    </div>
  );
}

export default withAuth(orders);

/* Page using withAuth to check user login status.
Design pattern:
-Nav bar
-App bar
-Three tool bars:
--1. Page name
--2. Search and filter
--3. Tabs for different load modes
-orderContent
--OrderCard









*/
