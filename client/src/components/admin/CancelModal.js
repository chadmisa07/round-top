import { Modal, Box, Button, Alert } from "@mui/material";
import React, { useState } from "react";

import { modalStyle } from "../constants";

const CancelModal = ({ open, handleClose, doFetchCustomers, user }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("@@@@@@@@@@@@@@ user >>>>>>>>>>>>>>>", user);

  const doUnsubscribe = async () => {
    setIsSubmitting(true);
    fetch(`${process.env.REACT_APP_DOMAIN}/cancel-subscription`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        subscriptionId: user.subscription_id,
        id: user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        doFetchCustomers();
        if (data.errMessage) setError(data.errMessage);
        if (data.message) {
          handleClose();
        }
      });
  };

  return (
    <Modal open={open} onClose={handleClose} className="relative">
      <Box sx={modalStyle}>
        {error ? (
          <div className="my-4">
            <Alert severity="error">{error}</Alert>
          </div>
        ) : null}

        <div className="my-6">
          <p>
            Are you sure you want to cancel the subscription of{" "}
            <b>{user.name}</b>?
          </p>
        </div>
        <div className="flex justify-center">
          <Button type="submit" variant="contained" onClick={doUnsubscribe}>
            Yes
          </Button>
          <span className="ml-2">
            <Button
              type="submit"
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </span>
        </div>
      </Box>
    </Modal>
  );
};

export default CancelModal;
