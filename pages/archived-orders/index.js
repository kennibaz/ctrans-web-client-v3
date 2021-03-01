import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head"
import NavBar from "../../components/NavBar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
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

  const [readyToReload, setReadyToReload] = useState(false);

 
  
//get initial order list
  useEffect(() => {
    const request = async () => {
      if (props.carrierId) {
        const resultOrders = await axios.post("/api/orders/archived-orders", {
          carrierId: props.carrierId,
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
        <title>C|Transporter - Archived Orders</title>
      </Head>
      <NavBar>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <Toolbar className={classes.upperToolBar}>
            <Grid>
              <Typography variant="h6" noWrap>
                ARCHIVED ORDERS
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
