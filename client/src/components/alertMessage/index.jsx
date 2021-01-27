import React from "react";
import { useSelector } from "react-redux";
import { Message } from "semantic-ui-react";
import "./index.scss";

const AlertMessage = () => {
  const errorMessage = useSelector((state) => state.error.errorMessage);
  const successMessage = useSelector((state) => state.error.successMessage);

  return (
    <>
      {errorMessage && errorMessage.length > 0 && (
        <Message
          id="errorMessage"
          icon="cancel"
          header="There was an error"
          content={errorMessage}
        />
      )}
      {successMessage && successMessage.length > 0 && (
        <Message
          id="successMessage"
          icon="check"
          header="There was a successful action"
          content={successMessage}
        />
      )}
    </>
  );
};

export default AlertMessage;
