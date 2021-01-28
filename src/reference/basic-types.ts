/* eslint-disable */

interface Car {
  color: string;
  manufacturingYear: number;
  hasManualTransmission: boolean;

  // any -> opt-out of type checking
  cargo: any;

  // array
  passengers: string[];

  // object
  engine: {
    cc: number;
    maximumPower: number;
    maximumTorque: string;
  };

  // method
  lock(pin: string): void; // method

  // property with lamdba
  unlock: (pin: string) => void;

  // modifiers
  driver?: string; // optional
  readonly brand: string; // readonly
}

// return type is at the end of the function
function buildName(
  requiredFirstName: string,
  optionalLastName?: string
): string {
  if (optionalLastName) {
    return requiredFirstName + " " + optionalLastName;
  }
  return requiredFirstName;
}

// an interface for a function only contains the arguments
// and return type as body
interface BuildNameFunction {
  (requiredFirstName: string, optionalLastName?: string): string;
}
