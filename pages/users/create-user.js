import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { Container } from "@material-ui/core";
import { withAuth } from "../../utils/withAuth";
import axios from "axios";

const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginTop: 0,
    border: 2,
  },
  upperToolBar: {
    color: "#d7d5da",
    background: "#432c7d",
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
  saveButton: {
    color: "white",
  },
}));

export default function CreateUser(props) {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState("");
  const [role, setRole] = useState("");

  //save handler
  const newUserSetHandler = async (currentStatus) => {
    await axios.post("https://ctrans.herokuapp.com/api/user-create", {
      firstName,
      lastName,
      email,
      phone,
      role,
      userId: props.userId,
    });
    props.closeNewUserDialogHandler()
  };

  return (
    <div>
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar className={classes.upperToolBar}>
          <Grid container>
            <Grid item xs={2}>
              <Typography variant="h6" noWrap>
                Create New User
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="inherit"
                classes={{
                  root: classes.saveButton,
                }}
                onClick={newUserSetHandler}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="inherit"
                classes={{
                  root: classes.saveButton,
                }}
                onClick={props.closeNewUserDialogHandler}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs" fixed>
        <CssBaseline />
        <Box mt={15}>
          <Grid container spacing={12} className={classes.container}>
            <Grid item xs={12}>
              <TextField
                id="first_name"
                defaultValue=""
                required
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="dense"
                label="First Name"
                name="driver_first_name"
                variant="outlined"
              />

              <TextField
                id="last_name"
                defaultValue=""
                required
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="dense"
                label="Last Name"
                name="driver_last_name"
                variant="outlined"
              />

              <TextField
                id="email"
                defaultValue=""
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
                label="Email"
                name="driver_email"
                variant="outlined"
              />

              <TextField
                id="phone"
                defaultValue=""
                required
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                margin="dense"
                label="Phone"
                name="driver_phone"
                variant="outlined"
              />

              <FormControl fullWidth>
                <Select
                  id="shipper_business_type"
                  margin="dense"
                  fullWidth
                  name="shipper_business_type"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value={"driver"}>Driver</MenuItem>
                  <MenuItem value={"dispatcher"}>Dispatcher</MenuItem>
                  <MenuItem value={"owner"}>Owner</MenuItem>
                  <MenuItem value={"technician"}>Technician</MenuItem>
                </Select>
                <FormHelperText>Select user role</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
