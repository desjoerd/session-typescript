import { showValidationForm } from "./helpers";
import { printValidationResult } from "./helpers/log";
import { combine, maxLength, min, required } from "./helpers/validation";

// ##################
//
// Demo
//
// ##################

// Our customer interface, with a nested object BankDetails :)
interface Customer {
  name: string;
  age: number;
  bankDetails: BankDetails;
  addresses: Address[];
}

interface BankDetails {
  country: string;
  iban: string;
}

interface Address {
  city: string;
  street: string;
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
// Extend ValidationConfig type so it supports arrays
// ##################

type ValidationConfig<TValue> = TValue extends Array<infer TItem>
  ? ArrayValidationConfig<TItem>
  : TValue extends object
  ? Schema<TValue>
  : ValidationFunction<TValue>;

type ArrayValidationConfig<TItem> = {
  $array?: ValidationFunction<TItem[]>;
  $item: ValidationConfig<TItem>;
};

// Schema now uses ValidationConfig instead of ValidationFunction
type Schema<T> = {
  [propertyIndexer in keyof T]: ValidationConfig<T[propertyIndexer]>;
};

// ##################
// Helpers
// ##################

function isArrayValidationConfig(
  config: ValidationConfig<any>
): config is ValidationConfig<any[]> {
  return config !== null && typeof config === "object" && "$item" in config;
}

function isObjectSchema(config: ValidationConfig<any>): config is Schema<any> {
  return (
    config !== null &&
    typeof config === "object" &&
    !isArrayValidationConfig(config)
  );
}

function isValidationFunction(
  config: ValidationConfig<any>
): config is ValidationFunction<any> {
  return typeof config === "function";
}

function validateSchema<T>(
  validationSchema: ValidationConfig<T>,
  value: T
): ValidationResult {
  if (isArrayValidationConfig(validationSchema)) {
    // validate array
    if (validationSchema.$array) {
      const validationResult = validationSchema.$array(value as any);
      if (validationResult.result === "error") {
        return validationResult;
      }
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const validationResult = validateSchema(
          validationSchema.$item,
          value[i]
        );
        if (validationResult.result === "error") {
          return {
            ...validationResult,
            message: `[${i}]:${validationResult.message}`
          };
        }
      }
    }
  } else if (isObjectSchema(validationSchema)) {
    // validate object
    if (value === undefined || value === null) {
      // assume required
      return {
        result: "error",
        message: `required`
      };
    }

    for (const key in validationSchema) {
      if (validationSchema.hasOwnProperty(key)) {
        const propertyValidator = validationSchema[key] as any;
        const propertyValue = (value as any)[key];

        const validationResult = validateSchema(
          propertyValidator,
          propertyValue
        );
        if (validationResult.result === "error") {
          return {
            ...validationResult,
            message: `${key}:${validationResult.message}`
          };
        }
      }
    }
  } else if (isValidationFunction(validationSchema)) {
    // call function
    return validationSchema(value);
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
  const schema: Schema<Customer> = {
    name: combine(required, maxLength(20)),
    age: combine(required, min(18)),
    bankDetails: { country: maxLength(2), iban: required },
    addresses: {
      $item: {
        street: required,
        city: required
      }
    }
  };

  const customerToValidate: Customer = {
    name: "very long name with a lot of characters",
    age: 16,
    bankDetails: {
      country: "NL",
      iban: "NL10INGB1234"
    },
    addresses: []
  };

  const validationResult = validateSchema(schema, customerToValidate);

  printValidationResult(validationResult);

  // ##################
  // UI
  // render validation app
  // ##################
  showValidationForm(
    (customer: Customer) => validateSchema(schema, customer),
    true,
    true
  );
}
