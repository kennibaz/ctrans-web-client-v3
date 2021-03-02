import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Link from "next/link";

import {
  Grid,
  Card,
  CardContent,
  Button,
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
  orderStatusButton: {
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

  //buttons status state

  const [isPhotosButtonEnabled, setIsPhotosButtonEnabled] = useState(false)

  //USEEFFECTS

  //Setup interface useEffect

  useEffect(() => {
    //set state for photosButton
    if (
      orderData.vehiclesArray[0]?.pickupInspectionPhotos?.length > 0
    ) {
      setIsPhotosButtonEnabled(true)
    }
  });

  // pack the photos object
  useEffect(() => {
    // let imagesRawPickup = [];
    let photoSchemaSetArray = []

    if (orderData.vehiclesArray[0].pickupInspectionPhotos) {
      orderData.vehiclesArray.forEach(
        (vehicle) => {
          const vehiclePhotosAndSchemaSet = {
            vehicleId: vehicle.vehicleId,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            vehiclePickupInspectionPhotos: vehicle.pickupInspectionPhotos,
            vehicleDeliveryInspectionPhotos: vehicle.deliveryInspectionPhotos,
            vehiclePickupInspectionSchema: vehicle.pickupInspectionSchema,
            vehicleDeliveryInspectionSchema: vehicle.deliveryInspectionSchema
          }
          photoSchemaSetArray.push(vehiclePhotosAndSchemaSet)
        }
      )
      setPickupImages(photoSchemaSetArray)
    }
    // if (orderData.vehiclesArray[0].pickupInspectionPhotos) {
    //   orderData.vehiclesArray[0].pickupInspectionPhotos.forEach(
    //     (image) => {
    //       const newImageSet = {
    //         original: image,
    //         thumbnail: image,
    //       };
    //       imagesRawPickup.push(newImageSet);
    //     }
    //   );
    //   setPickupImages(imagesRawPickup);
    // }
  }, [orderData.vehiclesArray[0].pickupInspectionPhotos]);

  // pack the photos object
  // useEffect(() => {
  //   let imagesRawDelivery = [];

  //   if (
  //     orderData.delivery.delivery_conditions?.delivery_inspection_images_links
  //   ) {
  //     orderData.delivery.delivery_conditions.delivery_inspection_images_links.forEach(
  //       (image) => {
  //         const newImageSet = {
  //           original: image,
  //           thumbnail: image,
  //         };
  //         imagesRawDelivery.push(newImageSet);
  //       }
  //     );

  //     setDeliveryImages(imagesRawDelivery);
  //   }
  // }, [
  //   orderData.delivery.delivery_conditions?.delivery_inspection_images_links,
  //   orderData.pickup.pickup_conditions?.pickup_inspection_images_links,
  // ]);

  //HANDLERS
  //cancel handler
  const cancelOrderHandler = async () => {
    await axios.post("/api/orders/order-cancel", {
      carrierId: carrierId,
      orderId,
    });
    reloadHandler();
  };

  // archive order
  const archiveOrderHandler = async () => {
    await axios.post("/api/orders/order-archive", {
      carrierId: carrierId,
      orderId,
    });
    reloadHandler();
  };

  // paid order
  const paidOrderHandler = async () => {
    if (orderData.orderStatus === "Delivered") {
      await axios.post("/api/orders/order-paid", {
        carrierId: carrierId,
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

  //Close photo carousel dialog
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
        carrierId={carrierId}
        drivers={drivers}
        orderStatus={orderData.orderStatus}
        order_id={orderId}
        shipperOrderId={orderData.shipperOrderId}
        order_assigned_driver={
          orderData.roles.driverId !== ""
            ? orderData.usersNames.driverName
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
      orderInstructions={orderData.orderInstructions}
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
  if (orderData.orderStatus === "Assigned" || orderData.orderStatus === "New") {
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
  if (orderData.orderStatus === "Paid") {
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
        <Grid id="vehicleContentYMM" item xs={12}>
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
        <Grid id="vehicleContentVin" item xs={12}>
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
          <Grid  container item xs={12}>
            <Box color="textPrimary" gutterBottom fontWeight="fontWeightMedium">
              {orderData.vehiclesArray.length} mix vehicles
              <IconButton
                aria-label="expand mixed vehicles row"
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
                <Grid id="vehicleContentYMMmultiVehicles" item xs={12}>
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
                <Grid id="vehiclesContentVinMultiVehicles" item xs={12}>
                  <Box
                    className={classes.title}
                    color="textPrimary"
                    gutterBottom
                    align="left"
                  >
                    {vehicle.vin}
                  </Box>
                </Grid>
                
              </div>
            ))}
          </Collapse>
        </Grid>
      </div>
    );
  }
   //MAIN BODY
  /*
STRUCTURE
Container
---Grid 12
    ---Card
      ---Box
        ---CardContent
          ---Grid = Container 1
            ---Grid = Row 1 (First row with buttons)
              ---Grid item (2) ShipperOrderId
              ---Grid item (1) orderStatus
              ---Grid item (4) assignButton
              ---Grid item (1) archiveButton
              ---Grid item (1) cancelButton
              ---Grid item (1) editButton
              ---Grid item (1) bolButton
              ---Grid item (1) photosButton
            ---Grid = Row 2 (Data row)
              ---Grid container (2) column_1
                ---Box
                  --- Grid item (12) vehicleContentYMM
                  --- Grid item (12) vehicleContenVin
                  --- Grid item (12) orderAmount
                  --- Grid item (12) paymentStatus
                  --- Grid item (12) paymentOptions

*/
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card className={classes.card} elevation={0}>
          <Box border={1} borderRadius={5} borderColor="text.disabled">
            <CardContent>
             
              <Grid id="container_1" container spacing={1}>
          {/* ----------------------START OF FIRST ROW---------------------*/}

                <Grid id="row_1" container item xs={8}>

                  <Grid id="shipperOrderId" item xs={2}>
                    <Link href={`/orders/details/${orderId}`} passHref>
                      <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                      >
                        {orderData.shipperOrderId}
                      </Button>
                    </Link>
                  </Grid>

                  <Grid id="orderStatus" item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      fontWeight="fontWeightMedium"
                    >
                      <Button size="small" disabled className={classes.orderStatusButton} color="#f1f1f1" >
                        {orderData.orderStatus}
                      </Button>
                    </Box>
                  </Grid>


                  <Grid id="assignButton" item xs={4}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      {assignButtonAndDialog}{" "}
                    </Box>
                  </Grid>


                  <Grid id="archiveButton" item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      {archiveButtonContent}
                    </Box>
                  </Grid>

                  <Grid id="cancelButton" item xs={1}>
                    <Box
                      className={classes.title}
                      color="textPrimary"
                      align="left"
                    >
                      {cancelButtonContent}
                    </Box>
                  </Grid>

                  <Grid id="editButton" item xs={1}>
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

                  <Grid id="bolButton" item xs={1}>
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


                  <Grid id="photosButton" item xs={1}>
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
                          !isPhotosButtonEnabled
                        }
                      >
                        PHOTOS{" "}
                      </Button>
                    </Box>
                  </Grid>
        
                </Grid>
                {/* ----------------------END OF FIRST ROW---------------------*/}
                {/* ----------------------START OF SECOND ROW---------------------*/}
                <Grid id="row_2" container item xs={12}>

                  <Grid id="column_1" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      {vehiclesContent}
                      <Divider />
                      <Grid item xs={12}>
                        <h1></h1>{" "}
                      </Grid>

                      <Grid id="orderAmount" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          Order amount: ${orderData.orderPayment.orderAmount}
                        </Box>
                      </Grid>

                      <Grid id="paymentStatus" item xs={12}> {/* TODO */}
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          Not received
                        </Box>
                      </Grid>

                      <Grid id="paymentOptions" item xs={12}>
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
                              Mark as PAID
                            </MenuItem>
                          </Menu>
                        </Box>
                      </Grid>

                    </Box>
                  </Grid>

                  <Grid id="column_2" container item xs={2}>

                    <Box borderLeft={1} borderColor="primary.main" p={1}>

                      <Grid id="originColumnName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          color="text.secondary"
                          fontWeight="fontWeightMedium"
                        >
                          {iconOriginEditContent}
                          ORIGIN @ {orderData.pickup.pickupScheduledFirstDate}
                        </Box>
                      </Grid>

                      {/* <Grid id="originDate" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontStyle="italic"
                        >
                          @ {orderData.pickup.pickupScheduledFirstDate}
                        </Box>
                      </Grid> */}

                      <Grid id="originBusinessName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          {orderData.pickup.pickupAddress.businessName}
                        </Box>
                      </Grid>

                      <Grid id="originAddress1" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          {orderData.pickup.pickupAddress.city +
                            "," +
                            " " +
                            orderData.pickup.pickupAddress.state +
                            " " +
                            orderData.pickup.pickupAddress.zip}
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
                        <Grid id="originAddress2" item xs={12}>
                          <Box
                            className={classes.title}
                            color="textPrimary"
                            gutterBottom
                            align="left"
                          >
                            {orderData.pickup.pickupAddress.address}
                          </Box>
                        </Grid>
                      </Collapse>

                      <Grid id="originContactName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          pt={2}
                        >
                          {orderData.pickup.pickupAddress.contactName}
                        </Box>
                      </Grid>

                      <Grid id="originPhone" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: {orderData.pickup.pickupAddress.phones[0]}
                          {orderData.pickup.pickupAddress.phones?.length > 1 ? (
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
                          {orderData.pickup.pickupAddress.phones
                            .slice(1)
                            .map((phone, index) => (
                              <Box
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                                align="left"
                                key={index}
                              >
                                P: {phone}
                              </Box>
                            ))}
                        </Grid>
                      </Collapse>
                    </Box>
                  </Grid>

                  <Grid id="column_3" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid id="destinationColumnName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          color="text.secondary"
                          fontWeight="fontWeightMedium"
                        >
                          {iconDestinationEditContent}
                          DESTINATION @ {orderData.delivery.deliveryScheduledFirstDate}
                        </Box>
                      </Grid>

                      {/* <Grid id="destinationDate" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontStyle="italic"
                        >
                          @ {orderData.delivery.deliveryScheduledFirstDate}
                        </Box>
                      </Grid> */}

                      <Grid id="destinationBusinessName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          {orderData.delivery.deliveryAddress.businessName}
                        </Box>
                      </Grid>

                      <Grid id="destinationAddress1" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          {orderData.delivery.deliveryAddress.city +
                            "," +
                            " " +
                            orderData.delivery.deliveryAddress.state +
                            " " +
                            orderData.delivery.deliveryAddress.zip}
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
                        <Grid id="destinationAddress2"item xs={12}>
                          <Box
                            className={classes.title}
                            color="textPrimary"
                            gutterBottom
                            align="left"
                          >
                            {orderData.delivery.deliveryAddress.address}
                          </Box>
                        </Grid>
                      </Collapse>

                      <Grid id="destinationContactName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          pt={2}
                        >
                          {orderData.delivery.deliveryAddress.contactName}
                        </Box>
                      </Grid>

                      <Grid id="destinationPhone" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: {orderData.delivery.deliveryAddress.phones[0]}
                          {orderData.delivery.deliveryAddress.phones?.length >
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
                          {orderData.delivery.deliveryAddress.phones
                            .slice(1)
                            .map((phone, index) => (
                              <Box
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                                align="left"
                                key={index}
                              >
                                P: {phone}
                              </Box>
                            ))}
                        </Grid>
                      </Collapse>
                    </Box>
                  </Grid>

                  <Grid id="column_4" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid id="shipperColumnName" item xs={12}>
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

                      <Grid id="shipperBusinessName" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                          fontWeight="fontWeightMedium"
                        >
                          {orderData.shipper.businessName}
                        </Box>
                      </Grid>

                      <Grid id="shipperPhone" item xs={12}>
                        <Box
                          className={classes.title}
                          color="textPrimary"
                          align="left"
                        >
                          P: {orderData.shipper.phone}
                        </Box>
                      </Grid>

                      <Grid id="shipperInstructions" item xs={12}>
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

                  <Grid id="column_5" container item xs={2}>
                    <Box borderLeft={1} borderColor="primary.main" p={1}>
                      <Grid id="notes" item xs={12}>
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
