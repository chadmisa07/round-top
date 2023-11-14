
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import React, { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Form() {

    const [inputs, setInputs] = useState({});
    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }    
    
    const [quantity, setQuantity] = useState('');
    const handleQtyChange = (event) => {
      setQuantity(event.target.value);
      handleChange(event);
    };  
  
    const submitForm = async function(event) {      
      console.log(inputs);
      event.preventDefault();
      await fetch("http://127.0.0.1:8000/subscribe", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(inputs)
      })
      .then(async (res) => res.text())
      .then((data) => alert(JSON.parse(data).message))
      .catch((err) => console.log(err));
    }  

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                <Item>
                    <img width="100%" src="https://goldbelly.imgix.net/uploads/merchant/main_image/1281/Zuckers-Merchant-Banner__.jpg" alt="bagels"/>
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
                        <TextField fullWidth label="Name" name="name" color="secondary" onChange={handleChange} />
                        </Grid>
                        <Grid item>
                        <TextField fullWidth label="Address" name="address" color="secondary" onChange={handleChange} />
                        </Grid>
                        <Grid item>
                        <FormControl fullWidth>
                            <InputLabel name="quantity-label">Quantity</InputLabel>
                            <Select
                            labelId="quantity-label"
                            name="quantity"
                            value={quantity}
                            label="quantity"
                            onChange={handleQtyChange}
                            >
                            <MenuItem value={6}>Pack of 6</MenuItem>
                            <MenuItem value={12}>Pack of 12</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item>
                        <TextField fullWidth label="Postal Code" name="postal_code" color="secondary" onChange={handleChange} />
                        </Grid>
                        <Grid item>
                        <TextField fullWidth label="Phone #" name="phone_number" color="secondary" onChange={handleChange} />
                        </Grid>
                        <Grid item>         
                        <Button type="submit" variant="contained">Subscribe</Button>
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