import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";


const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,

  },
  drawerPaper: {
    width: drawerWidth,
    background:'#735cab',
    color: "#d7d5da"
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: "#fafafa",
    padding: theme.spacing(0),
  },
}));

export default function PermanentDrawerLeft(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
    
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary={"ORDERS"} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={"USERS"} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={"INVENTORY"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button >
            <ListItemText primary={"ROUTES"} />
          </ListItem>
          <ListItem button >
            <ListItemText primary={"TRIPS"} />
          </ListItem>
          <ListItem button >
            <ListItemText primary={"SETTINGS"} />
          </ListItem>
          <ListItem button >
            <ListItemText primary={"Sign out"} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.toolbar} />
        <div className={classes.toolbar} />
        {/* <h1>TEST</h1> */}
        {props.children}
      </main>
    </div>
  );
}