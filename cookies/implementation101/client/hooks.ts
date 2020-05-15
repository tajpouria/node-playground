import * as React from "react";

export const useHandleChange = <ValuesT extends object>(
  initialValues: Record<string, any>,
) => {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (eve: React.ChangeEvent<HTMLInputElement>) => {
    const name = eve.target.name;
    const value = eve.target.value;
    setValues((pr) => ({ ...pr, [name]: value }));
  };

  return { values, handleChange } as {
    values: ValuesT;
    handleChange: (eve: React.ChangeEvent<HTMLInputElement>) => void;
  };
};
