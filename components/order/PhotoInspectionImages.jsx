import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import ImageGallery from "react-image-gallery";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "react-image-gallery/styles/css/image-gallery.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
  media: {
    height: 100,
    width: 100,
  },
});

export default function PhotoInspectionImages({
  pickupImages,
  deliveryImages,
  isOpen,
  closePhotoInspectionDialog,
}) {
  const classes = useStyles();
  const [openModalImages, setOpenModalImages] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [anchorElementForYMMButton, setAnchorElementForYMMButton] = useState(
    null
  );

  useEffect(() => {
    setCarouselImages(pickupImages);
  }, [pickupImages]);

  useEffect(() => {
    if (isOpen) {
      console.log(pickupImages)
    }
    
  }, [pickupImages])

  const handleYMMButtonOpen = (event) => {
    setAnchorElementForYMMButton(event.currentTarget);
  };
  const handleYMMButtonClose = () => {
    setAnchorElementForYMMButton(null);
  };

  const handleClickOpen = () => {
    setOpenModalImages(true);
  };

  const handleClose = () => {
    setOpenModalImages(false);
  };

  const setPickupImages = () => {
    setCarouselImages(pickupImages);
  };

  const setDeliveryImages = () => {
    setCarouselImages(deliveryImages);
  };

  if (!carouselImages) {
    return null;
  }
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={closePhotoInspectionDialog}
        TransitionComponent={Transition}
        style={{ width: "100%", backgroundColor: "transparent" }}
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        {" "}
        <Box width="100%" p={1}>
          <Grid container direction="row" justify="center">
            <Grid item xs={5}>
              <div>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleYMMButtonOpen}
                >
                  Open Menu
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElementForYMMButton}
                  keepMounted
                  open={Boolean(anchorElementForYMMButton)}
                  onClose={handleYMMButtonClose}
                >
                  {/* {pickupImages.map((order) => (
                    <MenuItem onClick={handleYMMButtonClose}>
                      {order.vehicleYear +
                        " " +
                        order.vehicleMake +
                        " " +
                        vehicleModel}
                    </MenuItem>
                  ))} */}
                </Menu>
              </div>
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={setPickupImages}
                variant="outlined"
                size="small"
                disabled={pickupImages.length < 1}
              >
                Pickup
              </Button>
            </Grid>
            <Grid item xs={2}>
              {" "}
              <Button
                onClick={setDeliveryImages}
                variant="outlined"
                size="small"
                disabled={deliveryImages.length < 1}
              >
                Delivery
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={closePhotoInspectionDialog}
                variant="outlined"
                size="small"
              >
                CLose
              </Button>
            </Grid>
          </Grid>
        </Box>
        <ImageGallery items={carouselImages} />;
      </Dialog>
    </div>
  );
}
