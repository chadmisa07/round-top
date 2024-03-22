import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Checkbox,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

const PACKS = [
  { value: 6, label: "Pack of 6" },
  { value: 12, label: "Pack of 12" },
];

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Form = ({
  submitForm,
  handleChange,
  initialState,
  success,
  error,
  routes,
  isUpdate = false,
  isDisabledUpdateButton,
  isSubmitting,
}) => {
  const {
    city,
    name,
    phone_number,
    postal_code,
    quantity,
    email,
    route_id,
    accept_alert,
    street,
    number,
    apartment,
  } = initialState;

  const isDisabled =
    !city ||
    !name ||
    !phone_number ||
    !postal_code ||
    !quantity ||
    !emailPattern.test(email) ||
    isSubmitting ||
    !street ||
    !number ||
    !accept_alert;

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
              label="Nom"
              name="name"
              color="secondary"
              onChange={handleChange}
              value={name}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Ville"
              name="city"
              color="secondary"
              onChange={handleChange}
              value={city}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Rue"
              name="street"
              color="secondary"
              onChange={handleChange}
              value={street}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Numéro Civic"
              name="number"
              color="secondary"
              onChange={handleChange}
              value={number}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Appartement"
              name="apartment"
              color="secondary"
              onChange={handleChange}
              value={apartment}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="Code Postal"
              name="postal_code"
              color="secondary"
              onChange={handleChange}
              value={postal_code}
            />
          </div>
          <div className="my-4">
            <FormControl fullWidth>
              <InputLabel name="quantity-label">Quantité</InputLabel>
              <Select
                labelId="quantity-label"
                name="quantity"
                label="Quantité"
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

          <div className="my-4 flex justify-center w-full items-center">
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
              onChange={handleChange}
              value={phone_number}
            />
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              color="secondary"
              onChange={handleChange}
              value={email}
            />
          </div>

          {!isUpdate && (
            <div className="my-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={accept_alert}
                    onChange={handleChange}
                    color="primary" // You can change the color to 'secondary' or 'default'
                    name="accept_alert"
                  />
                }
                label="J'accepte de recevoir des alertes de livraisons par texto"
              />
            </div>
          )}

          {isUpdate ? (
            <>
              <div className="my-4">
                <FormControl fullWidth>
                  <InputLabel name="quantity-label">Itinéraire</InputLabel>
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
            <Button
              type="submit"
              variant="contained"
              disabled={isDisabled}
              className="!normal-case"
            >
              {isUpdate ? "Mise à jour" : "M'abonner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
