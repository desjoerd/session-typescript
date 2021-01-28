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

type Schema<T> = {
  [propertyIndexer in keyof T]: ValidationConfig<T[propertyIndexer]>;
};

type ValidationConfig<TValue> = TValue extends Array<infer TItem>
  ? ArrayValidationConfig<TItem>
  : TValue extends object
  ? Schema<TValue>
  : ValidationFunction<TValue>;

type ArrayValidationConfig<TItem> = {
  $array?: ValidationFunction<TItem[]>;
  $item: ValidationConfig<TItem>;
};
