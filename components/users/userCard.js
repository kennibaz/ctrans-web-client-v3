import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
    margin: "auto",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  card: {
    marginTop: "5px",
    marginLeft: "10px",

  },
  card_inactive: {
    marginTop: "5px",
    marginLeft: "10px",
    background: "#fa5f44"
  },
  button: {
    fontSize: 11,
  },
  inColumnButton: {
    fontSize: 11,
    marginTop: 6,
  },
}));

export default function userCard(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {props.users.map((user, index) => (
          <Card
            className={user.data.active? classes.card:  classes.card_inactive}
            elevation={0}
            onClick={() => {
              props.userSelectrHandler(index);
            }}
          >
            <Box border={1} borderRadius={5} borderColor="text.disabled">
              <CardContent>
                <h3>
                  {user.data.firstName} {user.data.lastName} {user.data.role}{" "}
                </h3>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}
