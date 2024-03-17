import { Alert } from "@mui/material";
import React from "react";

const SuccessErrorMessage = ({ success, error, containerClassName }) => {
  return (
    <>
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

export default SuccessErrorMessage;
