import React, { useEffect } from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function SnackBarMUI(props) {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    props.closeSuccess();
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    props.closeWarning();
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.openSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success">
          {props.successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={props.openWarning}
        autoHideDuration={3000}
        onClose={handleCloseWarning}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseWarning} severity="warning">
          {props.warningMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
const mapStatesToProps = (state) => {
  return {
    openSuccess: state.util.openSuccess,
    successMessage: state.util.successMessage,
    openWarning: state.util.openWarning,
    warningMessage: state.util.warningMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeSuccess: (parent) =>
      dispatch({
        type: "CLOSE_SUCCESS",
      }),
    closeWarning: (parent) =>
      dispatch({
        type: "CLOSE_WARNING",
      }),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(SnackBarMUI);
