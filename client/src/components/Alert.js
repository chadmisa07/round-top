import { Alert } from "@mui/material";
import React from "react";

const AlertMessage = ({ success, error, containerClassName, loading }) => {
  return (
    <>
      {loading && (
        <div className={containerClassName || "my-4"}>
          <Alert severity="info">
            <span className="font-semibold">{loading}</span>
          </Alert>
        </div>
      )}
      {success && (
        <div className={containerClassName || "my-4"}>
          <Alert severity="success">
            <span className="font-semibold">{success}</span>
          </Alert>
        </div>
      )}
      {error && (
        <div className={containerClassName || "my-4"}>
          <Alert severity="error">
            <span className="font-semibold">{error}</span>
          </Alert>
        </div>
      )}
    </>
  );
};

export default AlertMessage;
