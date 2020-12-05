import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";


import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from "@material-ui/core/Grid";



const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function EditPhoneDialog(props) {

  const closeDialogHandler = async () => {
    props.setIsEditPhonesOnDeliveryOpen(false);
  };

  useEffect(()=>{
    if (props.phones.length === 0){
      closeDialogHandler()
    }
  })
  if (!props.phones) {
    return null;
  }

  return (
    <div>
      <Dialog
        onClose={closeDialogHandler}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="customized-dialog-title" onClose={closeDialogHandler}>
          Edit phone numbers
        </DialogTitle>
        <DialogContent dividers>
          {props.phones &&
            props.phones.map((phone, index) => (
              <Grid container>
                <Grid item xs={10}>
                  <Button disabled>{phone}</Button>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => {
                      props.removePhoneHandler(index);
                    }}
                  >
                    <DeleteForeverIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            ))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeDialogHandler} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
