import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "../../components/NavBar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Slide from "@material-ui/core/Slide";
import axios from "axios";

import { withAuth } from "../../utils/withAuth";

import UserCard from "../../components/users/userCard";
import UserDetailsCard from "../../components/users/UserDetailsCard";
import CreateUser from "./create-user"

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function users(props) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const [showDispatchers, setShowDispatchers] = useState(false);
  const [readyToUpdateUsers, setReadyToUpdateUsers] = useState(false);
  const [readyToReload, setReadyToReload] = useState(false);
  const [userDetailsData, setUserDetailsData] = useState("");
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);

  useEffect(() => {
    const request = async () => {
      if (props.carrierId) {
        const resultUsers = await axios.post("/api/users", {
          carrierId: props.carrierId,
          showAll: true,
          userId: props.userId,
          token: props.token,
        });

        setUsers(resultUsers.data);
        setUserDetailsData(resultUsers.data[0]);
      }
    };
    request();
  }, [readyToReload, props.carrierId]);

  useEffect(() => {
    const request = async () => {
      if (props.carrierId) {
        const resultUsers = await axios.post("/api/users", {
          carrierId: props.carrierId,
          showAll: true,
          userId: props.userId,
          token: props.token,
        });
        setUsers(resultUsers.data);
      }
    };
    request();
  }, [props.carrierId]);

  useEffect(() => {
    if (readyToUpdateUsers) {
      if (!showDrivers && !showDispatchers) {
        setShowAll(true);
        const request = async () => {
          const resultUsers = await axios.post("/api/users", {
            showAll: true,
            carrierId: props.carrierId,
            userId: props.userId,
            token: props.token,
          });
          setReadyToUpdateUsers(false);
          setUsers(resultUsers.data);
        };
        request();
        return;
      }

      const request = async () => {
        const resultUsers = await axios.post("/api/users", {
          showAll,
          showDrivers,
          showDispatchers,
          carrierId: props.carrierId,
          userId: props.userId,
          token: props.token,
        });

        setReadyToUpdateUsers(false);
        setUsers(resultUsers.data);
      };
      request();
    }
  }, [readyToUpdateUsers]);

  //handler of current user selection

  const userSelectrHandler = (index) => {
    setUserDetailsData(users[index]);
  };

  const reloadHandler = () => {
    setReadyToReload(!readyToReload);
    setReadyToUpdateUsers(true);
  };

  // handler to select status of the type of user to show
  const statusSelectHandler = (status) => {
    switch (status) {
      case "Drivers":
        setShowDrivers(!showDrivers);
        setShowAll(false);
        setReadyToUpdateUsers(true);
        break;
      case "Dispatchers":
        setShowDispatchers(!showDispatchers);
        setShowAll(false);
        setReadyToUpdateUsers(true);
        break;
    }
  };
  //show all users
  const showAllHandler = () => {
    setShowAll(true);
    setShowDrivers(false);
    setShowDispatchers(false);
  };

  const closeNewUserDialogHandler = () => {
    setOpenNewUserDialog(false);
    reloadHandler();
  };

  let usersContent = (
    <Grid container spacing={2} className={classes.container}>
      <Grid item container xs={2}>
        <UserCard users={users} userSelectrHandler={userSelectrHandler} />
      </Grid>
      <Grid item container xs={3}>
        <UserDetailsCard
          userDetailsData={userDetailsData}
          carrierId={props.carrierId}
          token={props.token}
          reloadHandler={reloadHandler}
        />
      </Grid>
    </Grid>
  );

  //Dialogs
  const newUserDialog = (
    <div>
      <Dialog
        fullScreen
        open={openNewUserDialog}
        onClose={closeNewUserDialogHandler}
        TransitionComponent={Transition}
      >
        <Container>
          <CreateUser closeNewUserDialogHandler={closeNewUserDialogHandler} userId={props.userId} />
        </Container>
      </Dialog>
    </div>
  );

  if (!users) {
    return null;
  }
  return (
    <div>
      <NavBar>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <Toolbar className={classes.upperToolBar}>
            <Grid>
              <Typography variant="h6" noWrap>
                USERS
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
                    showAllHandler();
                  }}
                  variant="outlined"
                  variant={showAll ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>DR</Avatar>}
                  label="Drivers"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler("Drivers");
                  }}
                  variant={showDrivers ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Chip
                  avatar={<Avatar>DP</Avatar>}
                  label="Dispatchers"
                  clickable
                  color="primary"
                  onClick={() => {
                    statusSelectHandler("Dispatchers");
                  }}
                  variant={showDispatchers ? "default" : "outlined"}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    setOpenNewUserDialog(true);
                  }}
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {usersContent}
        {newUserDialog}
      </NavBar>
    </div>
  );
}
export default withAuth(users);
