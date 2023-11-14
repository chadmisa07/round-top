import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function Form() {
    const [data, setData] = useState([]);

    useEffect(() => {
      fetch('http://127.0.0.1:8000/deliveryList')
      .then((res) => res.text())
      .then((data) => {
        console.log(JSON.parse(data));
        setData(JSON.parse(data))
      })
      .catch((err) => console.log(err));
    }, []);

    return (
      
      <Box sx={{ paddingTop: 2, flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <TableContainer component={Paper}>        
              <Typography variant="h4">Delivery List</Typography>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Phone #</TableCell>
                    <TableCell align="right">Postal Code</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.phone_number}</TableCell>
                      <TableCell align="right">{row.postal_code}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>          
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    );
}

export default Form;