// import Feedback from "../../../assets/images/icons/feedback.svg";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, { useState } from "react";
import { Post } from "../../common/common";
import swal from "sweetalert";
import { getLocal } from "../../common/localStorageAccess";
import MuiDialog from "../../common/MuiDialog";

var jsonData = require("./nav.json");
const FeedBackComponent = (props) => {
  const { open, handleClose } = props;
  const [name, setName] = useState(getLocal("name") ?? "");
  const [email, setEmail] = useState(getLocal("email") ?? "");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await Post(0, "submit_feedback", { name, email, message });
      swal("Success", "Feedback added successfully", "success");
      setMessage("");
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      title={jsonData.dialog.title}
      onSubmit={handleSubmit}
    >
      <DialogContentText>{jsonData.dialog.contentText}</DialogContentText>
      <TextField
        {...(name ? {} : { autoFocus: true })}
        margin="dense"
        id="name"
        name="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        fullWidth
      />
      <TextField
        margin="dense"
        id="email"
        name="email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        fullWidth
      />
      <TextField
        {...(name ? { autoFocus: true } : {})}
        margin="dense"
        id="feedback"
        label="Feedback"
        type="text"
        name="message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        fullWidth
      />
    </MuiDialog>
  );
};

export default FeedBackComponent;
