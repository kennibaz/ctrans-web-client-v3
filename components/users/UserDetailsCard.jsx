import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "blue",
  },
  button: {
    marginLeft: "auto",
  },
}));

export default function UserDetailsCard(props) {
  const classes = useStyles();
  const [readyToReload, setReadyToReload] = useState(false)
  

  const userChangeStatusHandler = async () => {
    props.reloadHandler()

    await axios.post("/api/users/user-change-status", {
      token: props.token,
      carrierId: props.carrierId,
      userId: props.userDetailsData.id,
    });
  };

  if (!props.userDetailsData) {
    return null;
  }
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card className={classes.card} elevation={0}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                B
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${props.userDetailsData?.data.firstName} ${props.userDetailsData?.data.lastName}`}
            subheader={`${props.userDetailsData?.data.role}`}
          />
          <CardContent>
            <Divider />

            <List component="nav" aria-label="main mailbox folders">
              <ListItem button>
                <ListItemIcon>
                  <PhoneIphoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${props.userDetailsData?.data.phone}`}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <AlternateEmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${props.userDetailsData?.data.email}`}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="4 vehicles" />
              </ListItem>
            </List>
          </CardContent>

          <CardActions disableSpacing>
            <Button
              className={classes.button}
              variant="outlined"
              size="small"
              onClick={userChangeStatusHandler}
            >
              {props.userDetailsData?.data.active ? "Deactivate" : "Activate"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
