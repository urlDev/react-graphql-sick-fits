import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  // Using useEffect here to set the inputs as whats coming from db if there is any
  // assigning an initialValues const because we want to check if initial values are
  // changing.
  useEffect(() => {
    // this func runs when things are changed
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }

    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );

    setInputs(blankState);
  }

  // return from the custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
