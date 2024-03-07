import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

import TextField from "@mui/material/TextField";

import React, { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Form() {
  const [inputs, setInputs] = useState({});
  const [postContent, setPostContent] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const submitForm = (event) => {
    console.log(inputs);
    event.preventDefault();

    const params = { ...inputs };
    fetch(`${process.env.REACT_APP_DOMAIN}/sendSMS`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(params),
    })
      .then(async (res) => res.text())
      .then((data) => alert(JSON.parse(data).message))
      .catch((err) => console.log(err));
  };

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
      width: 90%;
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 8px 12px;
      border-radius: 8px;
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[700] : grey[200]
      };
      box-shadow: 0px 2px 2px ${
        theme.palette.mode === "dark" ? grey[900] : grey[50]
      };

      &:hover {
        border-color: ${blue[400]};
      }

      &:focus {
        border-color: ${blue[400]};
        box-shadow: 0 0 0 3px ${
          theme.palette.mode === "dark" ? blue[600] : blue[200]
        };
      }

      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Item>
            <img
              width="100%"
              src="https://goldbelly.imgix.net/uploads/merchant/main_image/1281/Zuckers-Merchant-Banner__.jpg"
              alt="bagels"
            />
          </Item>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Item>
            <form onSubmit={submitForm} method="POST">
              <Grid container direction={"column"} spacing={2}>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    color="secondary"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    color="secondary"
                    onChange={handleChange}
                  />
                  {/* <Textarea value={postContent} fullWidth aria-label="Message" name="message" minRows={3} placeholder="Enter message..." onChange={e => setPostContent(e.target.value)} /> */}
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained">
                    Send SMS
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Item>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
}

export default Form;
