import { Modal, Box, TextField, Button, Alert } from "@mui/material";
import React, { useState } from "react";

import { modalStyle } from "./constants";

const UnsubscribeModal = ({ open, handleClose, setSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handlePhoneNumberChange = (value) => {
    if (value && !/^[0-9]+$/.test(value)) return;
    setPhoneNumber(value);
  };

  const doUnsubscribe = async () => {
    fetch(`${process.env.REACT_APP_DOMAIN}/unsubscribe`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errMessage) setError(data.errMessage);
        if (data.message) {
          handleClose();
          setSuccess(data.message);
        }
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="relative"
    >
      <Box sx={modalStyle}>
        <div className="my-4">
          <Alert severity="info">
            After submitting, please respond to a confirmation text message to
            complete unsubscribing!
          </Alert>
        </div>

        {error ? (
          <div className="my-4">
            <Alert severity="error">{error}</Alert>
          </div>
        ) : null}

        <div className="my-6">
          <TextField
            fullWidth
            label="Phone #"
            name="phone_number"
            color="secondary"
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            value={phoneNumber}
            autoFocus
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            disabled={!phoneNumber}
            onClick={doUnsubscribe}
          >
            Unsubscribe
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default UnsubscribeModal;
