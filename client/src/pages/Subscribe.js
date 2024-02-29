import React, { useEffect, useState } from "react";

// import Button from "@mui/material/Button";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
// import Alert from "@mui/material/Alert";

import { useParams, useNavigate } from "react-router-dom";
import UnsubscribeModal from "../components/UnsubscribeModal";
import Form from "../components/Form";

function Subscribe(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { session_id } = params;
  const [inputs, setInputs] = useState({});
  const [subscriptionId, setSubscriptionId] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  const doShowUnsubscribeModal = (value) => {
    setShowUnsubscribeModal(value);
  };

  // const { address, name, phone_number, postal_code, quantity, email } = inputs;
  const { quantity } = inputs;

  // const [clientSecret, setClientSecret] = useState("");
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "phone_number" && value && !/^[0-9]+$/.test(value)) return;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  // const [quantity, setQuantity] = useState("");

  // const handleQtyChange = (event) => {
  //   setQuantity(event.target.value);
  //   handleChange(event);
  // };

  const doCheckOut = async (userId) => {
    const res = await fetch(
      `${process.env.REACT_APP_DOMAIN}/create-checkout-session`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          lookup_key: String(quantity),
          user_info: inputs,
          userId,
        }),
      }
    );

    const body = await res.json();
    if (body?.url) {
      window.location.href = body.url;
    }

    if (body?.errMessage) setError(body.errMessage);
  };

  const submitForm = async function (event) {
    event.preventDefault();
    await fetch(`${process.env.REACT_APP_DOMAIN}/subscribe`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(inputs),
    })
      .then(async (res) => res.json())
      .then((data) => {
        if (data?.userId) doCheckOut(data.userId);
        if (data?.errMessage) setError(data.errMessage);
      });
  };

  useEffect(() => {
    if (session_id && !subscriptionId) {
      const setSubscription = async () => {
        const res = await fetch(
          `${process.env.REACT_APP_DOMAIN}/set-subscription`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ session_id }),
          }
        );

        const data = await res.json();
        if (data?.subscriptionId) {
          setSuccess(
            "You have successfully subscribe to the bagels delivery weekly!"
          );
          navigate("/");
        }
        setSubscriptionId(data.subscriptionId);
      };

      setSubscription();
    }

    // if (session_id) {
    //   setIsSuccess(true);
    //   navigate("/");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/exhaustive-deps
  }, [session_id]);

  // const isDisabled =
  //   !address ||
  //   !name ||
  //   !phone_number ||
  //   !postal_code ||
  //   !quantity ||
  //   !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  return (
    <>
      {showUnsubscribeModal ? (
        <UnsubscribeModal
          open={showUnsubscribeModal}
          handleClose={() => doShowUnsubscribeModal(false)}
          setSuccess={setSuccess}
        />
      ) : null}

      <div className="relative px-10 py-5 bg-slate-200 min-h-screen flex justify-center flex-col">
        <div className="bagels__container bg-white cv__container lg:max-w-4xl xl:max-w-5xl md:max-w-3xl px-4 md:px-0 md:mx-auto sm:w-1/2 w-full rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-end mr-8 mt-4 ">
            <span
              onClick={() => doShowUnsubscribeModal(true)}
              className="cursor-pointer font-semibold text-sm text-[blue]"
            >
              Unsubscribe?
            </span>
          </div>
          <div className="bagels-logo w-full flex justify-center">
            <div className="bagels-logo__container p-6">
              <img
                src="https://goldbelly.imgix.net/uploads/merchant/main_image/1281/Zuckers-Merchant-Banner__.jpg"
                alt="bagels"
              />
            </div>
          </div>
          <div className="bagels-form md:px-14 pb-6 px-6">
            <div className="flex items-center flex-col">
              <h1 className="font-semibold text-2xl">
                Subscribe to{" "}
                <span className="font-bold">Bagels Round Top&nbsp;</span>
                for a delivery
              </h1>
            </div>

            {/* {isSuccess && (
            <div className="my-4">
              <Alert severity="success">
                <span className="font-semibold">
                  You have successfully subscribe to the bagels delivery weekly!
                </span>
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
                />
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  color="secondary"
                  onChange={handleChange}
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
                  >
                    <MenuItem value={6}>Pack of 6</MenuItem>
                    <MenuItem value={12}>Pack of 12</MenuItem>
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
              <div className="my-4 flex justify-center">
                <Button type="submit" variant="contained" disabled={isDisabled}>
                  Subscribe
                </Button>
              </div>
            </form>
          </div> */}

            <Form
              submitForm={submitForm}
              handleChange={handleChange}
              // isDisabled={isDisabled}
              initialState={inputs}
              error={error}
              success={success}
            />
          </div>
        </div>
        {/* <div className="my-4 flex justify-center">
        <Button type="button" variant="contained" onClick={doCheckOut}>
          Testing Checkout
        </Button>
      </div> */}
      </div>
    </>
  );
}

export default Subscribe;
