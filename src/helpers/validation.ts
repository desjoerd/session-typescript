interface InvalidValidationResult {
  result: "error";
  message: string;
}

interface ValidValidationResult {
  result: "valid";
}

type ValidationResult = ValidValidationResult | InvalidValidationResult;

export function required(value: unknown): ValidationResult {
  if (!value) {
    return {
      result: "error",
      message: "This field is required"
    };
  } else {
    return {
      result: "valid"
    };
  }
}

export function maxLength<T extends { length: number }>(maxLength: number) {
  return function (value: T): ValidationResult {
    if (!value) {
      return {
        result: "valid"
      };
    }
    if (value.length <= maxLength) {
      return {
        result: "valid"
      };
    } else {
      return {
        result: "error",
        message: `Length should be ${maxLength} or lower`
      };
    }
  };
}

export function max(max: number) {
  return function (value: number): ValidationResult {
    if (!value) {
      return {
        result: "valid"
      };
    }
    if (value <= max) {
      return {
        result: "valid"
      };
    } else {
      return {
        result: "error",
        message: `Value should be ${max} or lower`
      };
    }
  };
}

export function min(min: number) {
  return function (value: number): ValidationResult {
    if (!value) {
      return {
        result: "valid"
      };
    }
    if (value >= min) {
      return {
        result: "valid"
      };
    } else {
      return {
        result: "error",
        message: `Value should be ${min} or higher`
      };
    }
  };
}

export function combine<TValue>(
  ...validations: ((value: TValue) => ValidationResult)[]
): (value: TValue) => ValidationResult {
  return function (value: TValue) {
    for (const validation of validations) {
      const validationResult = validation(value);
      if (validationResult.result === "error") {
        return validationResult;
      }
    }
    return {
      result: "valid"
    };
  };
}
