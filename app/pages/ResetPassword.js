import React, { useEffect } from "react";
import Page from "../components/Shared/Page";

function ResetPassword(props) {
  const resetPassToken = props.match.params.resetPassToken;
  // TODO: Check if token matches the one in the backend
  // TODO: If match check if token is expired
  // If expired display your reset token has expired
  // else show reset password form
  return (
    <Page title="Reset password">
      <h1>Reset pass</h1>
    </Page>
  );
}

export default ResetPassword;
