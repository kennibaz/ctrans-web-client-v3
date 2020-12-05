import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import ImageGallery from "react-image-gallery";
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

export default function PhotoInspectionImages(props) {
  const classes = useStyles();
  const [openModalImages, setOpenModalImages] = useState(false);
  const [carouselImages, setCarouselImages] = useState([])

  useEffect(() => {
      setCarouselImages(props.pickupImages)
    
  }, [props.pickupImages])

  const handleClickOpen = () => {
    setOpenModalImages(true);
  };

  const handleClose = () => {
    setOpenModalImages(false);
  };

  const setPickupImages = () => {
      setCarouselImages(props.pickupImages)
  }

  const setDeliveryImages = () => {
    setCarouselImages(props.deliveryImages)
}

if(!carouselImages){
    return null
}
  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={props.closePhotoInspectionDialog}
        TransitionComponent={Transition}
        style={{ width: "100%", backgroundColor: "transparent" }}
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        {" "}
       
          <Box width="100%" p={1}>
          <Grid container direction="row" justify="center">
            <Grid item xs={3}>
              <Button
               onClick={setPickupImages}
                variant="outlined"
                size="small"
                disabled={props.pickupImages.length <1}
              >
                Pickup
              </Button>
            </Grid>
            <Grid item xs={3}>
              {" "}
              <Button
                onClick={setDeliveryImages}
                variant="outlined"
                size="small"
                disabled={props.deliveryImages.length <1}
              >
                Delivery
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                onClick={props.closePhotoInspectionDialog}
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
