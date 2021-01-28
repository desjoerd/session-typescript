import React, { Fragment, useCallback, useState } from "react";

interface AppProps {
  validationFunction: (customer: any) => any;
  showAddresses?: boolean;
  showBankDetails?: boolean;
}

interface Address {
  id?: number;
  city: string;
  street: string;
}

interface BankDetails {
  country: string;
  iban: string;
}

interface Customer {
  name: string;
  age: number;
  bankDetails?: BankDetails;
  addresses?: Address[];
}

let addressId = 0;

export default function App({
  validationFunction,
  showAddresses,
  showBankDetails
}: AppProps) {
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    age: 0
  });
  const [validationResult, setValidationResult] = useState<any>(
    validationFunction(customer)
  );

  const setCustomerAndValidate = useCallback(
    (customer: any) => {
      setCustomer(customer);
      setValidationResult(validationFunction(customer));
    },
    [setCustomer, setValidationResult, validationFunction]
  );

  const addAddress = useCallback(() => {
    const currentAddresses = customer.addresses ?? [];

    const newAddresses: Address[] = [
      ...currentAddresses,
      {
        id: ++addressId,
        city: "",
        street: ""
      }
    ];

    setCustomerAndValidate({ ...customer, addresses: newAddresses });
  }, [customer, setCustomerAndValidate]);

  const removeAddress = useCallback(
    (address: Address) => {
      const currentAddresses = customer.addresses ?? [];
      const newAddresses = currentAddresses.filter(
        (existing) => existing !== address
      );

      setCustomerAndValidate({ ...customer, addresses: newAddresses });
    },
    [customer, setCustomerAndValidate]
  );

  const updateAddressAndValidate = useCallback(
    (address: Address, index: number) => {
      const currentAddresses = customer.addresses ?? [];
      const newAddresses = [...currentAddresses]; // copy
      newAddresses[index] = address; // set new value
      setCustomerAndValidate({ ...customer, addresses: newAddresses });
    },
    [customer, setCustomerAndValidate]
  );

  return (
    <div className="App">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setValidationResult(validationFunction(customer));
        }}
      >
        <h2>input</h2>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          onChange={(event) =>
            setCustomerAndValidate({ ...customer, name: event.target.value })
          }
        />
        <br />
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="text"
          onChange={(event) =>
            setCustomerAndValidate({
              ...customer,
              age: Number(event.target.value)
            })
          }
        />
        {showBankDetails && (
          <Fragment>
            <h3>Bank Details</h3>
            <label htmlFor="bankDetails.country">Country</label>
            <input
              id="bankDetails.country"
              type="text"
              onChange={(event) =>
                setCustomerAndValidate({
                  ...customer,
                  bankDetails: {
                    ...customer.bankDetails,
                    country: event.target.value
                  }
                })
              }
            />
            <br />
            <label htmlFor="bankDetails.iban">Iban</label>
            <input
              id="bankDetails.iban"
              type="text"
              onChange={(event) =>
                setCustomerAndValidate({
                  ...customer,
                  bankDetails: {
                    ...customer.bankDetails,
                    iban: event.target.value
                  }
                })
              }
            />
            <br />
          </Fragment>
        )}
        <br />
        {customer.addresses?.map((address, index) => (
          <Fragment key={address.id}>
            <h3>Address {index}</h3>
            <label htmlFor={`address[${index}].street`}>Street</label>
            <input
              id={`address[${index}].street`}
              type="text"
              onChange={(event) =>
                updateAddressAndValidate(
                  {
                    ...address,
                    street: event.target.value
                  },
                  index
                )
              }
            />
            <br />
            <label htmlFor={`address[${index}].city`}>City</label>
            <input
              id={`address[${index}].city`}
              type="text"
              onChange={(event) =>
                updateAddressAndValidate(
                  {
                    ...address,
                    city: event.target.value
                  },
                  index
                )
              }
            />
            <br />
            <button type="button" onClick={() => removeAddress(address)}>
              Remove address
            </button>
          </Fragment>
        ))}
        <hr />
        {showAddresses && (
          <button type="button" onClick={addAddress}>
            Add address
          </button>
        )}
      </form>

      <h2>result</h2>
      <pre>{JSON.stringify(validationResult, null, 2)}</pre>
    </div>
  );
}
