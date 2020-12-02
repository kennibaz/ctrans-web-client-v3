import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Menu,
  MenuItem,
  Box,
  Divider,
  Collapse,
  IconButton,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  EditIcon,
} from "@material-ui/core";


//dialogs
import AssignDriverDialog from "./dialogs/AssignDriverDialog";



const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
    margin: "auto",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  row_5: {
    border: 10,
  },
  card: {
    marginTop: "5px",
    marginLeft: "10px",
  },
  button: {
    fontSize: 11,
  },
  inColumnButton: {
    fontSize: 11,
    marginTop: 6,
  },
}));

export default function orderCard({orderData, drivers, orderId, reloadHandler}) {
  const classes = useStyles();


  //Assign Driver Dialog
  const assignButtonAndDialog =  (
    <div>
      <AssignDriverDialog
        carrier_id={"1840b8a5-3381-41f7-9838-8ad23a7b50bd"}
        drivers={drivers}
        order_status={orderData.order_status}
        order_id={orderId}
        order_shipper_inner_id={orderData.order_shipper_inner_id}
        order_assigned_driver={orderData.roles.driver_system_id !== ""
        ? orderData.users_names.driver_name
        : "Not assigned"}
        reloadHandler={reloadHandler}
      />
    </div>
  );


  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card className={classes.card} elevation={0}>
          <Box border={1} borderRadius={5} borderColor="text.disabled">
            <CardContent>
              <Grid id="container-1" container spacing={1}>
                <Grid id="first_row" container item xs={8}>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      // onClick={selectCardHandler}
                      size="small"
                      className={classes.button}
                    >
                      {orderData.order_shipper_inner_id}
                    </Button>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      fontWeight="fontWeightMedium"
                    >
                      <Button size="small" disabled className={classes.button}>
                      {orderData.order_status}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
    
                        {assignButtonAndDialog}{" "}
                     
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        className={classes.button}
                      >
                        CANCEL{" "}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        className={classes.button}
                      >
                        EDIT{" "}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        className={classes.button}
                      >
                        BOL{" "}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        className={classes.button}
                      >
                        PHOTO{" "}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid id="second_row" container item xs={12}>
                  <Grid id="first_column" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          1999 Ford Mustang
                        </Box>
                      </Grid>

                      <Divider />
                      <Grid item xs={12}>
                        <h1></h1>{" "}
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          Order amount: $
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          Not received
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          <Button
                            aria-controls="options-menu"
                            aria-haspopup="true"
                            variant="outlined"
                            size="small"
                            //   id={props.order_id}
                            //   onClick={menuHandleClick}
                            className={classes.inColumnButton}
                          >
                            Options
                          </Button>
                          <Menu
                            id="options-menu"
                            //   anchorEl={anchorEl}
                            keepMounted
                            //   open={Boolean(anchorEl)}
                            //   onClose={menuHandleClose}
                          >
                            {/* <MenuItem onClick={paidOrderHandler}>
                            Mark as Paid
                          </MenuItem> */}
                          </Menu>
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid id="second_column" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          color="text.secondary"
                          fontWeight="fontWeightMedium"
                        >
                          ORIGIN
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontStyle="italic"
                        >
                          @ scheduled date
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          Business Name
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          Pinellas Park, FL 33781
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          pt={2}
                        >
                          Mark Trockiy
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: +7 7727898565
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid id="third_column" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          color="text.secondary"
                          fontWeight="fontWeightMedium"
                        >
                          DESTINATION
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontStyle="italic"
                        >
                          @ scheduled date
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          Business Name
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          Pinellas Park, FL 33781
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          pt={2}
                        >
                          Mark Trockiy
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: +7 7727898565
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid id="fourth_column" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          color="text.secondary"
                          fontWeight="fontWeightMedium"
                        >
                          SHIPPER
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          Business Name
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: +7 7727898565
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            className={classes.inColumnButton}
                          >
                            Open instructions
                          </Button>
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid id="fifth_column" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          color="text.secondary"
                          fontWeight="fontWeightMedium"
                        >
                          NOTES
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
