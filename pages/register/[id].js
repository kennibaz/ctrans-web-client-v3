import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    height: 15,
  },
  testField: {
    padding: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  autocomplete: {
    width: 150,
  },
}));
export default function UserValidation(props) {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const classes = useStyles();
  const router = useRouter();
  const confirmHandler = async () => {
    if (password !== rePassword) {
      alert("Password doesn't match");
      return;
    }
    await axios.post("http://ctrans.herokuapp.com/api/confirm-new-user", {
      password: password,
      registrationId: router.query.id,
    });
    router.push("/signin")
  };

  return (
    <Container maxWidth="xs">
      <Grid container spacing={2}>
        <Grid id="row_1" item container xs={12} justify="center">
          <Grid item xs={10}>
            <Typography>
              <Box fontSize="h4.fontSize" m={2}>
                Set your password
              </Box>
            </Typography>
          </Grid>
        </Grid>
        <Grid id="row_2" item container xs={12} justify="center">
          <Grid item xs={12}>
            <Box height="25%">
              <TextField
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
                fullWidth
                name="password"
                label="New password"
                type="password"
                variant="outlined"
                InputProps={{ classes: { input: classes.input1 } }}
              />
            </Box>{" "}
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="rePassword"
              required
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              margin="dense"
              fullWidth
              name="rePassword"
              label="Repeat password"
              type="password"
              variant="outlined"
              InputProps={{ classes: { input: classes.input1 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={confirmHandler} variant="outlined" color="primary" fullWidth>Confirm</Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
