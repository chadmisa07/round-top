import { Modal, Box, TextField, Button } from "@mui/material";
import React, { useState } from "react";

import Alert from "./Alert";
import { modalStyle } from "./constants";

const UnsubscribeModal = ({ open, handleClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      body: JSON.stringify({
        phoneNumber: `${process.env.REACT_APP_DEFAULT_AREA_CODE}${phoneNumber}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errMessage) setError(data.errMessage);
        if (data.message) {
          setSuccess(data.message);

          setTimeout(() => handleClose(), 5000);
        }
      });
  };

  return (
    <Modal open={open} onClose={handleClose} className="relative">
      <Box sx={modalStyle}>
        <Alert error={error} success={success} />

        <div className="my-6 flex justify-center w-full">
          <div className="max-w-11">
            <div className="flex justify-center items-center border px-3 py-[15px] border-gray-300 rounded-l-[4px] bg-gray-200">
              {process.env.REACT_APP_DEFAULT_AREA_CODE}
            </div>
          </div>
          <TextField
            className="phone-number"
            fullWidth
            label="Téléphone #"
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
            disabled={!phoneNumber || success || error}
            onClick={doUnsubscribe}
            className="!normal-case"
          >
            Désabonner
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default UnsubscribeModal;
