import React from "react";
import { render } from "react-dom";

import App from "./App";

export function showValidationForm(
  validationFunction: (customer: any) => any,
  showAddresses?: boolean,
  showBankDetails?: boolean
) {
  const rootElement = document.getElementById("root");
  render(
    <App
      validationFunction={validationFunction}
      showAddresses={showAddresses}
      showBankDetails={showBankDetails}
    />,
    rootElement
  );
}
