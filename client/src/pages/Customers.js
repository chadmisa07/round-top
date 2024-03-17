import React, { useCallback, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import UserUpdateModal from "../components/UserUpdateModal";
import CancelModal from "../components/admin/CancelModal";
import SuccessErrorMessage from "../components/SuccessErrorMessage";

function Form() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [isCancel, setIsCancel] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState(null);

  const doFetchCustomers = () => {
    fetch(`${process.env.REACT_APP_DOMAIN}/customers`)
      .then((res) => res.text())
      .then((data) => {
        setData(JSON.parse(data));
      })
      .catch((err) => setError(JSON.stringify(err)));

    fetch(`${process.env.REACT_APP_DOMAIN}/routes`)
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data);
      })
      .catch((err) => setError(JSON.stringify(err)));
  };

  useEffect(() => {
    doFetchCustomers();
  }, []);

  const doSetUser = (user) => setUser(user);

  const handleCloseUpdateModal = useCallback(() => {
    setUser(null);
    setIsUpdate(false);
  }, []);

  const handleCloseCancelModal = useCallback(() => {
    setUser(null);
    setIsCancel(false);
  }, []);

  return (
    <div>
      {isUpdate ? (
        <UserUpdateModal
          user={user}
          open={isUpdate}
          handleClose={handleCloseUpdateModal}
          routes={routes}
          doFetchCustomers={doFetchCustomers}
        />
      ) : null}

      {isCancel ? (
        <CancelModal
          user={user}
          open={isCancel}
          handleClose={handleCloseCancelModal}
          doFetchCustomers={doFetchCustomers}
        />
      ) : null}

      <Box sx={{ paddingTop: 2, flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SuccessErrorMessage error={error} containerClassName="mt-0 mb-2" />
            <TableContainer component={Paper}>
              <Typography variant="h4" className="pl-4 pt-4">
                Customer List
              </Typography>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-semibold">Name</TableCell>
                    <TableCell className="!font-semibold">Phone #</TableCell>
                    <TableCell className="!font-semibold">Status</TableCell>
                    <TableCell className="!font-semibold">
                      Postal Code
                    </TableCell>
                    <TableCell className="!font-semibold">Address</TableCell>
                    <TableCell className="!font-semibold">Quantity</TableCell>
                    <TableCell className="!font-semibold">
                      Delivery Date
                    </TableCell>
                    <TableCell className="!font-semibold">Route</TableCell>
                    <TableCell className="!font-semibold">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => {
                    const route = routes?.find(
                      (route) => route.id === row.route_id
                    );

                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell size="small">{row.phone_number}</TableCell>
                        <TableCell size="small">{row.status_desc}</TableCell>
                        <TableCell size="small">{row.postal_code}</TableCell>
                        <TableCell size="small">{row.address}</TableCell>
                        <TableCell size="small">{row.quantity}</TableCell>
                        <TableCell size="small">
                          {route?.delivery_date_desc}
                        </TableCell>
                        <TableCell size="small">{route?.name}</TableCell>
                        <TableCell size="small">
                          {row.status === 1 && (
                            <Button
                              type="button"
                              variant="contained"
                              onClick={() => {
                                doSetUser(row);
                                setIsUpdate(true);
                              }}
                            >
                              Update
                            </Button>
                          )}

                          {row.status !== 2 && (
                            <span className="ml-2">
                              <Button
                                type="button"
                                variant="contained"
                                onClick={() => {
                                  doSetUser(row);
                                  setIsCancel(true);
                                }}
                                color="error"
                              >
                                Cancel
                              </Button>
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Form;
