import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Link from "next/link";

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
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import PhotoInspectionImages from "./PhotoInspectionImages";
import LocationEditDialog from "./dialogs/LocationEditDialog";

//dialogs
import AssignDriverDialog from "./dialogs/AssignDriverDialog";
import InstructionsModal from "./dialogs/InstructionDialogModal";

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
  button: {
    fontSize: 11,
  },
  inColumnButton: {
    fontSize: 11,
    marginTop: 6,
  },
}));

export default function orderCard({
  orderData,
  drivers,
  orderId,
  carrierId,
  reloadHandler,
}) {
  const classes = useStyles();
  const [isEditMode, setIsEditMode] = useState(false);
  const [anchorElBol, setAnchorElBol] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [
    isPhotoInspectionDialogOpen,
    setIsPhotoInspectionDialogOpen,
  ] = useState(false);
  const [isLocationPickupDialogOpen, setIsLocationPickupDialogOpen] = useState(
    false
  );
  const [
    isLocationDeliveryDialogOpen,
    setIsLocationDeliveryDialogOpen,
  ] = useState(false);
  const [
    isInstructionsModalDialogOpen,
    setIsInstructionsModalDialogOpen,
  ] = useState(false);
  const [pickupImages, setPickupImages] = useState([]);
  const [deliveryImages, setDeliveryImages] = useState([]);
  const [openVehicles, setOpenVehicles] = useState(false);
  const [openPickupAddress, setOpenPickupAddress] = useState(false);
  const [openDeliveryAddress, setOpenDeliveryAddress] = useState(false);
  const [openPickupPhones, setOpenPickupPhones] = useState(false);
  const [openDeliveryPhones, setOpenDeliveryPhones] = useState(false);

  //USEEFFECTS

  // pack the photos object
  useEffect(() => {
    let imagesRawPickup = [];

    if (orderData.pickup.pickup_conditions?.pickup_inspection_images_links) {
      orderData.pickup.pickup_conditions.pickup_inspection_images_links.forEach(
        (image) => {
          const newImageSet = {
            original: image,
            thumbnail: image,
          };
          imagesRawPickup.push(newImageSet);
        }
      );

      setPickupImages(imagesRawPickup);
    }
  }, [orderData.pickup.pickup_conditions?.pickup_inspection_images_links]);

  // pack the photos object
  useEffect(() => {
    let imagesRawDelivery = [];

    if (
      orderData.delivery.delivery_conditions?.delivery_inspection_images_links
    ) {
      orderData.delivery.delivery_conditions.delivery_inspection_images_links.forEach(
        (image) => {
          const newImageSet = {
            original: image,
            thumbnail: image,
          };
          imagesRawDelivery.push(newImageSet);
        }
      );

      setDeliveryImages(imagesRawDelivery);
    }
  }, [
    orderData.delivery.delivery_conditions?.delivery_inspection_images_links,
    orderData.pickup.pickup_conditions?.pickup_inspection_images_links,
  ]);

  //HANDLERS
  //cancel handler
  const cancelOrderHandler = async () => {
    await axios.post("/api/orders/order-cancel", {
      carrierId: "1840b8a5-3381-41f7-9838-8ad23a7b50bd",
      orderId,
    });
    reloadHandler();
  };

  // archive order
  const archiveOrderHandler = async () => {
    await axios.post("/api/orders/order-archive", {
      carrierId: "1840b8a5-3381-41f7-9838-8ad23a7b50bd",
      orderId,
    });
    reloadHandler();
  };

  // paid order
  const paidOrderHandler = async () => {
    if (orderData.order_status === "Delivered") {
      await axios.post("/api/orders/order-paid", {
        carrierId: "1840b8a5-3381-41f7-9838-8ad23a7b50bd",
        orderId,
      });
      menuHandleClose();
      reloadHandler();
    } else {
      alert("You can mark as paid only after delivery");
      menuHandleClose();
    }
  };
  //BOL menu open
  const menuBolHandleClick = (event) => {
    setAnchorElBol(event.currentTarget);
  };

  // BOL  menu close
  const menuBolHandleClose = () => {
    setAnchorElBol(null);
  };

  //open menu popup and set current order
  const menuHandleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler to close menu popup
  const menuHandleClose = () => {
    setAnchorEl(null);
  };

  //BOL pickup
  const pickupBolOpenHandler = () => {
    const newWindow = window.open(
      orderData.order_bol?.pickup_BOL,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
    menuBolHandleClose();
  };

  //Close photo caroulse dialog
  const closePhotoInspectionDialog = () => {
    setIsPhotoInspectionDialogOpen(false);
  };

  //close pickup edit dialog
  const closePickupEditDialog = () => {
    setIsLocationPickupDialogOpen(false);
  };
  //close delivery edit dialog
  const closeDeliveryEditDialog = () => {
    setIsLocationDeliveryDialogOpen(false);
  };
  //close instruction dialog
  const closeInstructionsDialog = () => {
    setIsInstructionsModalDialogOpen(false);
  };

  //BOL delivery
  const deliveryBolOpenHandler = () => {
    const newWindow = window.open(
      orderData.order_bol?.delivery_BOL,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
    menuBolHandleClose();
  };

  //Assign Driver Dialog
  const assignButtonAndDialog = (
    <div>
      <AssignDriverDialog
        carrier_id={"1840b8a5-3381-41f7-9838-8ad23a7b50bd"}
        drivers={drivers}
        order_status={orderData.order_status}
        order_id={orderId}
        order_shipper_inner_id={orderData.order_shipper_inner_id}
        order_assigned_driver={
          orderData.roles.driver_system_id !== ""
            ? orderData.users_names.driver_name
            : "Not assigned"
        }
        reloadHandler={reloadHandler}
      />
    </div>
  );
  // pickup edit location dialog
  const pickupEditDialog = (
    <LocationEditDialog
      isOpen={isLocationPickupDialogOpen}
      closePickupEditDialog={closePickupEditDialog}
      carrierId={carrierId}
      orderId={orderId}
      orderData={orderData}
      pickup
      reloadHandler={reloadHandler}
    />
  );

  //Location editing dialog for delivery
  const deliveryEditDialog = (
    <LocationEditDialog
      isOpen={isLocationDeliveryDialogOpen}
      closePickupEditDialog={closeDeliveryEditDialog}
      carrierId={carrierId}
      orderId={orderId}
      orderData={orderData}
      reloadHandler={reloadHandler}
    />
  );

  // Instructions dialog
  let instructionsDialog = (
    <InstructionsModal
      order_instructions={orderData.order_instructions}
      isOpen={isInstructionsModalDialogOpen}
      closeInstructionsDialog={closeInstructionsDialog}
    />
  );

  //show photo carouse dialog
  let photoInspectionDialog = (
    <PhotoInspectionImages
      pickupImages={pickupImages}
      deliveryImages={deliveryImages}
      isOpen={isPhotoInspectionDialogOpen}
      closePhotoInspectionDialog={closePhotoInspectionDialog}
    />
  );

  //CONTENT

  let cancelButtonContent;
  if (
    orderData.order_status === "Assigned" ||
    orderData.order_status === "New"
  ) {
    cancelButtonContent = (
      <Button
        onClick={cancelOrderHandler}
        size="small"
        variant="outlined"
        className={classes.button}
      >
        Cancel
      </Button>
    );
  }

  let archiveButtonContent;
  if (orderData.order_status === "Paid") {
    archiveButtonContent = (
      <Button
        onClick={archiveOrderHandler}
        size="small"
        variant="outlined"
        className={classes.button}
      >
        Archive
      </Button>
    );
  }

  let iconOriginEditContent;
  if (isEditMode) {
    iconOriginEditContent = (
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => {
          setIsLocationPickupDialogOpen(true);
        }}
      >
        <EditIcon style={{ color: "red" }} />
      </IconButton>
    );
  }

  let iconDestinationEditContent;
  if (isEditMode) {
    iconDestinationEditContent = (
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => {
          setIsLocationDeliveryDialogOpen(true);
        }}
      >
        <EditIcon style={{ color: "red" }} />
      </IconButton>
    );
  }

  let vehiclesContent;
  if (orderData.vehiclesArray.length <= 1) {
    vehiclesContent = (
      <div>
        <Grid item xs={12}>
          <Box
            color="textPrimary"
            gutterBottom
            align="left"
            fontWeight="fontWeightMedium"
          >
            {orderData.vehiclesArray[0].year +
              " " +
              orderData.vehiclesArray[0].make +
              " " +
              orderData.vehiclesArray[0].model}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box color="textPrimary" gutterBottom align="left">
            {orderData.vehiclesArray[0].vin}
          </Box>
        </Grid>
      </div>
    );
  }

  if (orderData.vehiclesArray.length > 1) {
    vehiclesContent = (
      <div>
        <Grid container item xs={12}>
          <Grid container item xs={12}>
            <Box color="textPrimary" gutterBottom fontWeight="fontWeightMedium">
              {orderData.vehiclesArray.length} mix vehicles
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpenVehicles(!openVehicles)}
              >
                {openVehicles ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Box>
          </Grid>
          <Collapse in={openVehicles} timeout="auto" unmountOnExit>
            {orderData.vehiclesArray.map((vehicle, index) => (
              <div key={index}>
                <Grid item xs={12}>
                  <Box
                    className={classes.title}
                    color="textPrimary"
                    gutterBottom
                    align="left"
                    fontWeight="fontWeightMedium"
                  >
                    {vehicle.year + " " + vehicle.make + " " + vehicle.model}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    className={classes.title}
                    color="textPrimary"
                    gutterBottom
                    align="left"
                  >
                    {vehicle.vin}
                  </Box>
                </Grid>
                <Divider />
              </div>
            ))}
          </Collapse>
        </Grid>
      </div>
    );
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card className={classes.card} elevation={0}>
          <Box border={1} borderRadius={5} borderColor="text.disabled">
            <CardContent>
              <Grid id="container-1" container spacing={1}>
                <Grid id="first_row" container item xs={8}>
                  <Grid item xs={2}>
                    <Link href={`/orders/details/${orderId}`} passHref>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          console.log("hi");
                        }}
                        size="small"
                        className={classes.button}
                      >
                        {orderData.order_shipper_inner_id}
                      </Button>
                    </Link>
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
                      {archiveButtonContent}
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      {cancelButtonContent}
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      <Button
                        color="secondary"
                        size="small"
                        variant={isEditMode ? "contained" : "outlined"}
                        className={classes.button}
                        onClick={() => {
                          setIsEditMode(!isEditMode);
                        }}
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
                        onClick={menuBolHandleClick}
                      >
                        BOL{" "}
                      </Button>
                      <Menu
                        id="bol-menu"
                        anchorEl={anchorElBol}
                        keepMounted
                        open={Boolean(anchorElBol)}
                        onClose={menuBolHandleClose}
                      >
                        <MenuItem onClick={pickupBolOpenHandler}>
                          Pickup Bol
                        </MenuItem>

                        <MenuItem onClick={deliveryBolOpenHandler}>
                          Delivery Bol
                        </MenuItem>
                      </Menu>
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
                        onClick={() => {
                          setIsPhotoInspectionDialogOpen(true);
                        }}
                        disabled={
                          !orderData.pickup.pickup_conditions
                            ?.pickup_inspection_images_links &&
                          !orderData.delivery.delivery_conditions
                            ?.delivery_inspection_images_links
                        }
                      >
                        PHOTO{" "}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid id="second_row" container item xs={12}>
                  <Grid id="first_column" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      {vehiclesContent}
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
                          Order amount: ${orderData.order_total_amount}
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
                            id={orderId}
                            onClick={menuHandleClick}
                            className={classes.inColumnButton}
                          >
                            Options
                          </Button>
                          <Menu
                            id="options-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={menuHandleClose}
                          >
                            <MenuItem onClick={paidOrderHandler}>
                              Mark as Paid
                            </MenuItem>
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
                          {iconOriginEditContent}
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
                          @ {orderData.pickup.pickup_scheduled_first_date}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          {orderData.pickup.pickup_address.business_name}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          {orderData.pickup.pickup_address.city +
                            "," +
                            " " +
                            orderData.pickup.pickup_address.state +
                            " " +
                            orderData.pickup.pickup_address.zip}
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              setOpenPickupAddress(!openPickupAddress)
                            }
                          >
                            {openPickupAddress ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Grid>
                      <Collapse
                        in={openPickupAddress}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Grid item xs={12}>
                          <Box
                            className={classes.title}
                            color="textPrimary"
                            gutterBottom
                            align="left"
                          >
                            {orderData.pickup.pickup_address.address}
                          </Box>
                        </Grid>
                      </Collapse>

                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          pt={2}
                        >
                          {orderData.pickup.pickup_address.contact_name}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: {orderData.pickup.pickup_address.phones[0]}
                          {orderData.pickup.pickup_address.phones?.length >
                          1 ? (
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() =>
                                setOpenPickupPhones(!openPickupPhones)
                              }
                            >
                              {openPickupPhones ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          ) : null}
                        </Box>
                      </Grid>
                      <Collapse
                        in={openPickupPhones}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Grid item xs={12}>
                          {orderData.pickup.pickup_address.phones.slice(1).map(
                            (phone, index) => (
                              <Box
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                                align="left"
                                key={index}
                              >
                                P: {phone}
                              </Box>
                            )
                          )}
                        </Grid>
                      </Collapse>
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
                          {iconDestinationEditContent}
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
                          @ {orderData.delivery.delivery_scheduled_first_date}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          {orderData.delivery.delivery_address.business_name}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          {orderData.delivery.delivery_address.city +
                            "," +
                            " " +
                            orderData.delivery.delivery_address.state +
                            " " +
                            orderData.delivery.delivery_address.zip}
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              setOpenDeliveryAddress(!openDeliveryAddress)
                            }
                          >
                            {openDeliveryAddress ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Grid>
                      <Collapse
                        in={openDeliveryAddress}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Grid item xs={12}>
                          <Box
                            className={classes.title}
                            color="textPrimary"
                            gutterBottom
                            align="left"
                          >
                            {orderData.delivery.delivery_address.address}
                          </Box>
                        </Grid>
                      </Collapse>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          pt={2}
                        >
                          {orderData.delivery.delivery_address.contact_name}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: {orderData.delivery.delivery_address.phones[0]}
                          {orderData.delivery.delivery_address.phones?.length >
                          0 ? (
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() =>
                                setOpenDeliveryPhones(!openDeliveryPhones)
                              }
                            >
                              {openDeliveryPhones ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          ) : null}
                        </Box>
                      </Grid>
                      <Collapse
                        in={openDeliveryPhones}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Grid item xs={12}>
                          {orderData.delivery.delivery_address.phones.slice(1).map(
                            (phone, index) => (
                              <Box
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                                align="left"
                                key={index}
                              >
                                P: {phone}
                              </Box>
                            )
                          )}
                        </Grid>
                      </Collapse>
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
                          {orderData.shipper.business_name}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: {orderData.shipper.phone}
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
                            onClick={() => {
                              setIsInstructionsModalDialogOpen(true);
                            }}
                          >
                            Open instructions
                          </Button>
                          {instructionsDialog}
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
      {photoInspectionDialog}
      {pickupEditDialog}
      {deliveryEditDialog}
    </Grid>
  );
}
