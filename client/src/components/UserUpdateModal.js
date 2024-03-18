import React, { useState } from "react";
import { Modal, Box } from "@mui/material";

import Form from "./Form";
import { compareObjects } from "../utils";
import { modalStyle } from "./constants";

const UserUpdateModal = ({
  open,
  handleClose,
  user,
  routes,
  doFetchCustomers,
}) => {
  const phone_number = user.phone_number.replace(
    new RegExp(`^\\${process.env.REACT_APP_DEFAULT_AREA_CODE}`),
    ""
  );

  const [inputs, setInputs] = useState({
    ...user,
    phone_number,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "phone_number" && value && !/^[0-9]+$/.test(value)) return;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    fetch(`${process.env.REACT_APP_DOMAIN}/update-subscriber`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        ...inputs,
        phone_number: `${process.env.REACT_APP_DEFAULT_AREA_CODE}${inputs.phone_number}`,
      }),
    })
      .then(async (res) => res.json())
      .then((data) => {
        doFetchCustomers();
        if (data?.errMessage) {
          setError(data.errMessage);
        } else {
          doFetchCustomers();
          handleClose();
        }
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="relative"
    >
      <Box sx={modalStyle}>
        <div>
          <Form
            submitForm={submitForm}
            handleChange={handleChange}
            initialState={inputs}
            error={error}
            isSuccess={false}
            routes={routes}
            isSubmitting={isSubmitting}
            isUpdate
          />
        </div>
      </Box>
    </Modal>
  );
};

export default UserUpdateModal;
