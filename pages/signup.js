import React, { useState } from "react";
import { useRouter } from "next/router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const router = useRouter();
  const classes = useStyles();
  //set states for input handlers
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [carrierUSDOTNumber, setCarrierUSDOTNumber] = useState("");
  const [carrierAddress, setCarrierAddress] = useState("");
  const [carrierCity, setCarrierCity] = useState("");
  const [carrierZip, setCarrierZip] = useState("");
  const [carrierState, setCarrierState] = useState("");

  const [role, setRole] = useState("");
  const [step, setStep] = useState(1);

  const usdotCheckHandler = async () => {
    const respond = await axios.post(
      "https://ctrans.herokuapp.com/api/usdot-check",
      {
        usdot: carrierUSDOTNumber,
      }
    );
    if (respond.data.status === "not registered") {
      setCarrierUSDOTNumber(respond.data.USDOTNumber);
      setCarrierName(respond.data.carrierName);
      setCarrierAddress(respond.data.carrierAddress);
      setCarrierCity(respond.data.carrierCity);
      setCarrierZip(respond.data.carrierZip);
      setCarrierState(respond.data.carrierState);
      setStep(2);
    }

    if (respond.data.status === "registered") {
      setCarrierUSDOTNumber(respond.data.USDOTNumber);
      setCarrierName(respond.data.carrierName);
      setCarrierAddress(respond.data.carrierAddress);
      setCarrierCity(respond.data.carrierCity);
      // setCarrierZip(respond.data.carrierZip)
      // setCarrierState(respond.data.carrierState)
      setStep(3);
    }

    if (respond.data.error === "usdot not found") setStep(4);
  };

  const joinRequestUpHandler = async () => {
    //todo
  };

  const signUpHandler = async () => {
    const respond = await axios.post(
      "http://ctrans.herokuapp.com/api/new-carrier-create",
      {
        password,
        firstName,
        lastName,
        carrierName,
        carrierUSDOTNumber,
        carrierAddress,
        carrierCity,
        carrierZip,
        carrierState,
        email,
        phone,
        role,
      }
    );

    if (respond.data === "auth/email-already-exists") {
      alert("This email is already registered");
    } else if (respond.data === "auth/phone-number-already-exists") {
      alert("This phone is already registered");
    } else {
      router.push("/signin");
    }
  };

  let content;
  let contentRight
  
    content = (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <VerifiedUserIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ENTER YOUR USDOT #
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                id="usdot"
                required
                value={carrierUSDOTNumber}
                onChange={(e) => setCarrierUSDOTNumber(e.target.value)}
                margin="dense"
                name="usdot"
                variant="outlined"
                fullWidth
                autoFocus
                InputProps={{ classes: { input: classes.input1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                size="large"
                variant="outlined"
                onClick={usdotCheckHandler}
              >
                Verify
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h5" variant="h6">
                <Box color="primary.main">
                  To get started please enter your USDOT number first. Let's
                  verify your company information and you'll be on your way.
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h5" variant="h6">
                <Box color="primary.main">
                  If you don't have USDOT or operate outside of US, please
                  contact our Support team to proceed with sign up process.
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  

  if (step === 2) {
    contentRight = (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign up for
          </Typography>

          <Typography component="h1" variant="h6">
            {carrierUSDOTNumber} {carrierName}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
                label="Phone"
                name="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signUpHandler}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href={`/signin`}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }

  if (step === 3) {
    contentRight = (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
       
          <Typography component="h1" variant="h5">
            Join to
          </Typography>
          
          <Typography component="h1" variant="h5">
            {carrierUSDOTNumber} {carrierName}
          </Typography>
          

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
                label="Phone"
                name="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={joinRequestUpHandler}
          >
            Join
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href={`/signin`}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
      <div>{content}</div>;
      </Grid>
      <Grid item xs={6}>
      <div>{contentRight}</div>;
      </Grid>
    </Grid>
  );
}
