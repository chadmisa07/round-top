import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";

const PACKS = [
  { value: 6, label: "Pack of 6" },
  { value: 12, label: "Pack of 12" },
];

const Form = ({
  submitForm,
  handleChange,
  initialState,
  success,
  error,
  routes,
  isUpdate = false,
  isDisabledUpdateButton,
}) => {
  const {
    address,
    name,
    phone_number,
    postal_code,
    quantity,
    email,
    route_id,
  } = initialState;

  let isDisabled =
    !address ||
    !name ||
    !phone_number ||
    !postal_code ||
    !quantity ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // disable the update button on update modal if its value has not changed
  if (isUpdate) isDisabled = isDisabled || isDisabledUpdateButton;

  return (
    <div>
      {success && (
        <div className="my-4">
          <Alert severity="success">
            <span className="font-semibold">{success}</span>
          </Alert>
        </div>
      )}

      {error && (
        <div className="my-4">
          <Alert severity="error">
            <span className="font-semibold">{error}</span>
          </Alert>
        </div>
      )}
      <div>
        <form onSubmit={submitForm} method="POST">
          <div className="my-4">
            <TextField
              fullWidth
              label="Name"
              name="name"
              color="secondary"
              onChange={handleChange}
              value={name}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Address"
              name="address"
              color="secondary"
              onChange={handleChange}
              value={address}
            />
          </div>
          <div className="my-4">
            <FormControl fullWidth>
              <InputLabel name="quantity-label">Quantity</InputLabel>
              <Select
                labelId="quantity-label"
                name="quantity"
                label="quantity"
                onChange={handleChange}
                value={quantity}
              >
                {PACKS.map((pack) => (
                  <MenuItem key={pack.value} value={pack.value}>
                    {pack.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Postal Code"
              name="postal_code"
              color="secondary"
              onChange={handleChange}
              value={postal_code}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Phone #"
              name="phone_number"
              color="secondary"
              onChange={handleChange}
              value={phone_number}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Email"
              name="email"
              color="secondary"
              onChange={handleChange}
              value={email}
            />
          </div>
          {isUpdate ? (
            <>
              <div className="my-4">
                <FormControl fullWidth>
                  <InputLabel name="quantity-label">Route</InputLabel>
                  <Select
                    labelId="route-label"
                    name="route_id"
                    label="route"
                    onChange={handleChange}
                    value={route_id}
                  >
                    {routes.map((route) => (
                      <MenuItem key={route.id} value={route.id}>
                        {route.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </>
          ) : null}
          <div className="flex justify-center">
            <Button type="submit" variant="contained" disabled={isDisabled}>
              {isUpdate ? "Update" : "Subscribe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;