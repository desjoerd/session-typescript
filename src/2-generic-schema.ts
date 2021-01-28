import {} from "./1-simple-validation";
import { showValidationForm } from "./helpers";
import { printValidationResult } from "./helpers/log";

// ##################
//
// TODO
//
// 2.1 export the created interfaces and methods validateName and
// validateAge in "./1-simple-validation".
//
// 2.2 import the interfaces and methods validateName, validateAge into file
// (hint use, "ctrl + ." to open code actions)
//
// In the "run" section we have defined a schema, which is
// a validation function for each property (the ones you imported ;))
// The goal is to make the validation logic generic.
//
// In "1-simple-validation.ts" we've defined three "Validation functions".
//
// 2.3 Create a generic interface for a "Validation Function"
// which receives one parameter and returns "ValidationResult"
// Tip: Start with a non generic interface for the "validateName" function,
// than add generics
//
// 2.4 Now create an interface "CustomerSchema" with all properties of
// "Customer" but every property is a "Validation Function"
// You can annotate the functions or variables with your newly created
// types to let TypeScript check if everything is correct.
//
// 2.5 Discuss step 2.1 to 2.4
// 2.6 Intro to "Type Manipulation"
//
// 2.7 Create a generic Schema<T> "Type alias" with the "type" keyword which
// maps every property of an interface (Read "Customer" interface) to a
// "ValidationFunction"
//
// The result should be the same as the manually created "CustomerSchema"
// interface of 2.4.
//
// 2.8 Rename validateCustomerWithSchema to validateWithSchema (F2)
// 2.9 Add a generic parameter "T" which is going to replace the type for
// "customer" and give schema the generic Schema<T> type
//
// everything should now work the same as before, with the same type safety,
// but than it's generic and re-usable :)
//
// ##################

function validateCustomerWithSchema(validationSchema, customer) {
  for (const key in validationSchema) {
    if (validationSchema.hasOwnProperty(key)) {
      const propertyValidator = validationSchema[key];
      const validationResult = propertyValidator(customer[key]);

      if (validationResult.result === "error") {
        // we've found an error, return
        return {
          ...validationResult,
          message: `${key}: ${validationResult.message}`
        };
      }
    }
  }

  // no error found
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
  const schema = {
    name: validateName,
    age: validateAge
  };

  const customerToValidate = {
    name: "very long name with a lot of characters",
    age: 16
  };

  const validationResult = validateCustomerWithSchema(
    schema,
    customerToValidate
  );

  printValidationResult(validationResult);

  // ##################
  // UI
  // render validation app
  // ##################
  showValidationForm((customer: Customer) =>
    validateCustomerWithSchema(schema, customer)
  );
}
