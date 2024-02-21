import React, { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";

import Form from "./Form";
import { compareObjects } from "../utils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "4px",
  boxShadow: 24,
  p: 4,
};

const UserUpdateModal = ({
  open,
  handleClose,
  user,
  routes,
  doFetchCustomers,
}) => {
  const [inputs, setInputs] = useState(user);
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "phone_number" && value && !/^[0-9]+$/.test(value)) return;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const submitForm = async function (event) {
    event.preventDefault();
    setIsDisabled(true);
    await fetch(`http://${process.env.REACT_APP_DOMAIN}/update-subscriber`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(inputs),
    })
      .then(async (res) => res.json())
      .then((data) => {
        if (data?.errMessage) {
          setError(data.errMessage);
        } else {
          doFetchCustomers();
          handleClose();
        }
      });
  };

  const isDisabledUpdateButton = compareObjects(user, inputs) || isDisabled;
  console.log(
    "@@@@@ isDisabledUpdateButton >>>>>>>>>>>>",
    isDisabledUpdateButton
  );

  return (
    <Modal
      open={open}
      onClose={handleClose} //
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="relative"
    >
      <Box sx={style}>
        <div>
          <Form
            submitForm={submitForm}
            handleChange={handleChange}
            initialState={inputs}
            error={error}
            isSuccess={false}
            routes={routes}
            isDisabledUpdateButton={isDisabledUpdateButton}
            isUpdate
          />
        </div>
      </Box>
    </Modal>
  );
};

export default UserUpdateModal;
