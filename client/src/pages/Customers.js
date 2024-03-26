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
import Filters from "../components/admin/Filters";
import Alert from "../components/Alert";

function Form() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [user, setUser] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [isCancel, setIsCancel] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState("0");
  const [filterByRoute, setFilterByRoute] = useState("0");
  const [sortBy, setSortBy] = useState("id");

  const doFetchCustomers = () => {
    const brtJWT = localStorage.getItem("brt-jwt");
    fetch(`${process.env.REACT_APP_DOMAIN}/customers`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${brtJWT}`,
      },
    })
      .then((res) => res.text())
      .then((data) => {
        setData(JSON.parse(data));
        setFilteredData(JSON.parse(data));
      })
      .catch((err) => setError(JSON.stringify(err)));

    fetch(`${process.env.REACT_APP_DOMAIN}/routes`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${brtJWT}`,
      },
    })
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

  useEffect(() => {
    let newFilterData = data;
    if (filterByRoute !== "0") {
      newFilterData = newFilterData.filter(
        (x) => x.route_id === Number(filterByRoute)
      );
    }

    if (filterByStatus !== "0") {
      newFilterData = newFilterData.filter(
        (x) => x.status === Number(filterByStatus)
      );
    }

    //Sort
    function compareBy(a, b) {
      const nameA = a[sortBy];
      const nameB = b[sortBy];

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }

    if (newFilterData.length) {
      newFilterData = newFilterData.slice().sort(compareBy);
    }

    setFilteredData(newFilterData);
  }, [filterByStatus, filterByRoute, sortBy, data]);

  const doSetFilterByStatus = (filter) => {
    setFilterByStatus(filter);
  };

  const doSetFilterByRoute = (filter) => {
    setFilterByRoute(filter);
  };

  const doSetSortBy = (sort) => {
    setSortBy(sort);
  };

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

      <Box sx={{ paddingTop: 2, flexGrow: 1 }} className="shadow-lg border">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert error={error} containerClassName="mt-0 mb-2" />
            <TableContainer
              component={Paper}
              className="!border-none !shadow-none"
            >
              <Typography variant="h4" className="p-4 customer-list-header">
                Customer List
              </Typography>
              <Filters
                doSetFilterByStatus={doSetFilterByStatus}
                doSetFilterByRoute={doSetFilterByRoute}
                doSetSortBy={doSetSortBy}
                routes={routes}
              />
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-semibold">Name</TableCell>
                    <TableCell className="!font-semibold">Phone #</TableCell>
                    <TableCell className="!font-semibold status-col">
                      Status
                    </TableCell>
                    <TableCell className="!font-semibold">
                      Postal Code
                    </TableCell>
                    <TableCell className="!font-semibold">City</TableCell>
                    <TableCell className="!font-semibold">Number</TableCell>
                    <TableCell className="!font-semibold">Street</TableCell>
                    <TableCell className="!font-semibold">Apartment</TableCell>
                    <TableCell className="!font-semibold">Quantity</TableCell>
                    <TableCell className="!font-semibold">
                      Delivery Date
                    </TableCell>
                    <TableCell className="!font-semibold">Route</TableCell>
                    <TableCell className="!font-semibold action-col">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData?.length > 0 ? (
                    <>
                      {filteredData.map((row) => {
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
                            <TableCell size="small">{row.name}</TableCell>
                            <TableCell size="small">
                              {row.phone_number}
                            </TableCell>
                            <TableCell size="small status-row">
                              {row.status_desc}
                            </TableCell>
                            <TableCell size="small">
                              {row.postal_code}
                            </TableCell>
                            <TableCell size="small">{row.city}</TableCell>
                            <TableCell size="small">{row.number}</TableCell>
                            <TableCell size="small">{row.street}</TableCell>
                            <TableCell size="small">{row.apartment}</TableCell>
                            <TableCell size="small">{row.quantity}</TableCell>
                            <TableCell size="small">
                              {route?.delivery_date_desc}
                            </TableCell>
                            <TableCell size="small">{route?.name}</TableCell>
                            <TableCell size="small" className="action-row">
                              <div className="flex flex-wrap gap-1">
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
                                  <span>
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
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan={12} size="medium">
                          <div className="text-center">No record found.</div>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
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
