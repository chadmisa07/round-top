import { Alert } from "@mui/material";
import React from "react";

const SuccessErrorMessage = ({ success, error }) => {
  return (
    <>
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
    </>
  );
};

export default SuccessErrorMessage;
