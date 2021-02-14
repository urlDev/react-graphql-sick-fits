import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    #   Which variables are getting passed in and their types
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        # for photo, we are creating it since it is its own type
        # and it has a relation
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

const CreateProduct = () => {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: 'Nice shoes',
    description: 'These are the best shoes',
    price: 55,
    image: '',
  });
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      // this option will make the apollo refetch the predefined query
      // so after submitting the form, when we go to home page,
      // we wont have to refresh the page to see the last item we added
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // submit the input fields to backend
        const res = await createProduct({});
        clearForm();
        // go to that products page
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      {/* 
      Adding a fieldset to be able to disable it when trying to submit the form
      Aria-busy is for being able to manipulate the loader
      */}
      <DisplayError error={error} />
      <fieldset aria-busy={loading} disabled={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name}
            placeholder="Name"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            value={inputs.price}
            placeholder="Price"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            value={inputs.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </label>

        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
};

export default CreateProduct;
