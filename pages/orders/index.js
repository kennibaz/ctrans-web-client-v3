import React, { useState, useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
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
import { useRouter } from "next/router";

import OrderCard from "../../components/order/orderCard";
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

export default function orders(props) {
  const classes = useStyles();
  const router = useRouter();
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

  useEffect(() => {
    const request = async () => {
      const resultOrders = await axios.get("/api/orders");
      const resultDrivers = await axios.get("/api/drivers");
      setOrders(resultOrders.data);
      setOrdersForSearch(resultOrders.data);
      setDrivers(resultDrivers.data);
    };
    request();
  }, [readyToReload]);

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
        });

        setReadyToUpdateOrders(false);
        setOrders(resultOrders.data);
      };
      request();
    }
  }, [readyToUpdateOrders]);

  //search engine

  const searchHandler = () => {
    let searchToLower = searchWord.toLowerCase();
    const filteredResults = ordersForSearch.filter(
      (order) =>
        order.data.order_shipper_inner_id
          .toLowerCase()
          .includes(searchToLower) ||
        order.data.shipper.business_name
          .toLowerCase()
          .includes(searchToLower) ||
        order.data.vehiclesArray.some(
          (vehicle) => vehicle.make.toLowerCase() === searchToLower
        ) ||
        order.data.vehiclesArray.some(
          (vehicle) => vehicle.model.toLowerCase() === searchToLower
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
      case "New":
        setStatusNew(!statusNew);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case "Assigned":
        setStatusAssigned(!statusAssigned);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case "Picked":
        setStatusPicked(!statusPicked);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case "Delivered":
        setStatusDelivered(!statusDelivered);
        setStatusAll(false);
        setReadyToUpdateOrders(true);
        break;
      case "Paid":
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
              carrierId={"1840b8a5-3381-41f7-9838-8ad23a7b50bd"}
              reloadHandler={reloadHandler}
            />
          ))}
        </div>
      </Grid>
    </Grid>
  );

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

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.upperToolBar}>
          <Grid>
            <Typography variant="h6" noWrap>
              LOADS
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
                label="All"
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
                label="New"
                clickable
                color="primary"
                onClick={() => {
                  statusSelectHandler("New");
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
                  statusSelectHandler("Assigned");
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
                  statusSelectHandler("Picked");
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
                  statusSelectHandler("Delivered");
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
                  statusSelectHandler("Paid");
                }}
                variant={statusPaid ? "default" : "outlined"}
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {orderContent}

 
    </div>
  );
}
