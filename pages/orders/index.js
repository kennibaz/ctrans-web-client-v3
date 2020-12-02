import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

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
}));

export default function orders(props) {
  const classes = useStyles();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [statusAll, setStatusAll] = useState(true);
  const [statusNew, setStatusNew] = useState(false);
  const [statusAssigned, setStatusAssigned] = useState(false);
  const [statusPicked, setStatusPicked] = useState(false);
  const [statusDelivered, setStatusDelivered] = useState(false);
  const [statusPaid, setStatusPaid] = useState(false);
  const [readyToUpdateOrders, setReadyToUpdateOrders] = useState(false);
  const [readyToReload, setReadyToReload] = useState(false)

  useEffect(() => {
    const request = async () => {
      const resultOrders = await axios.get("/api/orders");
      const resultDrivers = await axios.get("/api/drivers");
      setOrders(resultOrders.data);
      setDrivers(resultDrivers.data);
    };
    request();
  }, [readyToReload]);

  useEffect(() => {
    if (
      !statusNew &&
      !statusAssigned &&
      !statusPicked &&
      !statusDelivered &&
      !statusPaid
    ) {
      setStatusAll(true);
    }
  }, [statusNew, statusAssigned, statusPicked, statusDelivered, statusPaid]);

  useEffect(() => {
    if (readyToUpdateOrders) {
      const request = async () => {
        const resultOrders = await axios.post("/api/orders", {
          statusAll,
          statusNew,
          statusAssigned,
          statusPicked,
          statusDelivered,
          statusPaid,
        });
        setReadyToUpdateOrders(false)
        setOrders(resultOrders.data)
      };
      request();
    }
  }, [readyToUpdateOrders]);

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
  const reloadHandler = () =>{
    setReadyToReload(!readyToReload)
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
          <Grid>
            <Typography variant="h6" noWrap>
              TOOL BAR
            </Typography>
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

      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <div className={classes.scrollable}>
            {orders.map((order) => (
              <OrderCard
                orderData={order.data}
                orderId={order.id}
                drivers={drivers}
                reloadHandler={reloadHandler}
              />
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
