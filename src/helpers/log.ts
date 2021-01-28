export function printValidationResult(validationResult: unknown) {
  if (typeof validationResult === "object" && validationResult !== null) {
    if ("message" in validationResult) {
      console.warn(validationResult);
    } else {
      console.log(validationResult);
    }
  }
}
