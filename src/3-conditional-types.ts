import { validateAge, validateName } from "./1-simple-validation";
import { showValidationForm } from "./helpers";
import { printValidationResult } from "./helpers/log";
import { maxLength, required } from "./helpers/validation";

// ##################
//
// TODO
//
// In this last section I am providing all current interfaces and
// types so we're on the same page :)
//
// The goal is to handle nested objects in a user friendly way
//
// 3.1 Update the Schema<T> type to use type ValidationConfig<TValue> instead
// of ValidationFunction<TValue>.
// ValidationConfig<TValue> is going to be our Conditional Type.
//
// 3.2 Update type "ValidationConfig<TValue>" to be a conditional type.
// Example usage is below in the "run" section :)
// Hint: When the property is an object it needs to be a Schema
// instead of a ValidationFunction
//
// ##################

// Our customer interface, with a nested object BankDetails :)
interface Customer {
  name: string;
  age: number;
  bankDetails: BankDetails;
}

interface BankDetails {
  country: string;
  iban: string;
}

// ##################
// Validation Library interfaces
//
// you can replace them with your versions if you want :)
// ##################
interface InvalidValidationResult {
  result: "error";
  message: string;
}

interface ValidValidationResult {
  result: "valid";
}

type ValidationResult = ValidValidationResult | InvalidValidationResult;

interface ValidationFunction<TValue> {
  (value: TValue): ValidationResult;
}

// ##################
// New ValidationConfig type, we're going to extend this :)
// ##################

type ValidationConfig<TValue> = ValidationFunction<TValue>;

// Schema now uses ValidationConfig instead of ValidationFunction
type Schema<T> = {
  [propertyIndexer in keyof T]: ValidationFunction<T[propertyIndexer]>;
};

/**
 * Our magic Validation Function
 */
function validateSchema<T>(
  validationSchema: Schema<T>,
  value: T
): ValidationResult {
  for (const key in validationSchema) {
    if (validationSchema.hasOwnProperty(key)) {
      const propertyValidator = validationSchema[key] as any;
      const propertyValue = (value as any)[key];

      let validationResult: ValidationResult;

      if (propertyValidator !== null && typeof propertyValidator === "object") {
        // assume it's a schema
        if (propertyValue !== undefined && propertyValue !== null) {
          validationResult = validateSchema(propertyValidator, propertyValue);
        } else {
          // assume required
          validationResult = {
            result: "error",
            message: `required`
          };
        }
      } else {
        validationResult = propertyValidator(propertyValue);
      }

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
  const schema: Schema<Customer> = {
    name: validateName,
    age: validateAge,
    // below is our goal, to define nested objects as nested Schemas
    bankDetails: {
      country: maxLength(2),
      iban: required
    }
  };

  const customerToValidate: Customer = {
    name: "very",
    age: 161,
    bankDetails: {
      country: "NL",
      iban: "NL10INGB1234"
    }
  };

  const validationResult = validateSchema(schema, customerToValidate);

  printValidationResult(validationResult);

  // ##################
  // UI
  // render validation app
  // ##################
  showValidationForm(
    (customer: Customer) => validateSchema(schema, customer),
    false,
    true
  );
}
