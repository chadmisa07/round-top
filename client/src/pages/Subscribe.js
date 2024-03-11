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

const Subscribe = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { session_id } = params;
  const [inputs, setInputs] = useState({
    city: "",
    address: "",
    name: "",
    phone_number: "",
    postal_code: "",
    quantity: "",
    email: "",
  });
  const [subscriptionId, setSubscriptionId] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doShowUnsubscribeModal = (value) => {
    setShowUnsubscribeModal(value);
  };

  const { quantity } = inputs;

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "phone_number" && value && !/^[0-9]+$/.test(value)) return;

    setInputs((values) => ({ ...values, [name]: value }));
  };

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

  const submitForm = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    fetch(`${process.env.REACT_APP_DOMAIN}/subscribe`, {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/exhaustive-deps
  }, [session_id]);

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

            <Form
              submitForm={submitForm}
              handleChange={handleChange}
              isSubmitting={isSubmitting}
              initialState={inputs}
              error={error}
              success={success}
            />
          </div>
          <div className="flex ml-8 my-4 ">
            <div className="flex justify-center">
              <span className="text-sm">
                Do you wish to&nbsp;
                <span
                  onClick={() => doShowUnsubscribeModal(true)}
                  className="cursor-pointer font-semibold text-[blue]"
                >
                  unsubscribe
                </span>
                ?
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;
