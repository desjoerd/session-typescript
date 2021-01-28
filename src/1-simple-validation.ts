import { showValidationForm } from "./helpers/index";
import { printValidationResult } from "./helpers/log";

// ##################
//
// TODO
//
// 1.1 Create an interface for Customer (in the run section)
// with name as string and age as number
//
// 1.2 Add type annotations to the functions
// - validateAge()
// - validateName()
// - validateCustomer()
//
// 1.3 Create an interface for the return type of the above methods
// and add it as type annation
// suggestion for naming, call it ValidationResult
//
// 1.4 Discuss step 1.1 to 1.3
// 1.5 Intro to "Union Types"
//
// 1.6 Create an Union type for ValidationResult with "status" as 'literal' type
// play around with checking the "status" property in an "if" statement
// can you make the "message" property disappear when the "result" === "valid"?
//
// make sure that you update the return types of the different functions
//
// 1.7 Create an interface for "one" of the following functions
// - validateName
// - validateAge
// - validateCustomer
//
// ##################

// ##################
// Interfaces and methods here
// ##################

export function validateName(name) {
  if (!name) {
    return {
      result: "error",
      message: "Name is required"
    };
  } else if (name.length > 10) {
    return {
      result: "error",
      message: "Name should be 10 characters or less"
    };
  } else {
    return {
      result: "valid"
    };
  }
}

export function validateAge(age) {
  if (age < 18) {
    return {
      result: "error",
      message: "Age should be 18 or higher"
    };
  }
  return {
    result: "valid"
  };
}

function validateCustomer(customer) {
  const nameValidationResult = validateName(customer.name);
  if (nameValidationResult.result === "error") {
    return nameValidationResult;
  }

  const ageValidationResult = validateAge(customer.age);
  if (ageValidationResult.result === "error") {
    return ageValidationResult;
  }

  return {
    result: "valid"
  };
}

// run is called from "index.ts"
export function run() {
  // ##################
  // example execution
  //
  // USE THIS SECTION AS PLAYGROUND :)
  // ##################
  const ageResult = validateAge(16);
  printValidationResult(ageResult);

  const nameResult = validateName("very long name with a lot of characters");
  printValidationResult(nameResult);

  // input is a customer object
  const customerResult = validateCustomer({
    name: "very long name with a lot of characters",
    age: 16
  });
  printValidationResult(customerResult);

  // ##################
  // UI
  // render validation app
  // ##################
  showValidationForm(validateCustomer);
}
