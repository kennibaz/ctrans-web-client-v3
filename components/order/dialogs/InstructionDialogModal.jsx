import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

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

export default function InstructionsModal(props) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={props.closeInstructionsDialog}
        TransitionComponent={Transition}
        style={{ width: "100%", backgroundColor: "transparent" }}
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        {" "}
        <Box width="100%" p={1}>
          <Typography>
            {props.orderInstructions
              ? props.orderInstructions
              : "NO INSTRUCTIONS DEFINED YET"}
          </Typography>
        </Box>
      </Dialog>
    </div>
  );
}
