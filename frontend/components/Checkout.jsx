import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutForm = () => {
  const { closeCart } = useCart();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const handleSubmit = async (e) => {
    // 1. Stop the form from submitting and turn the loader
    e.preventDefault();
    setLoading(true);
    // 2. start the page transition
    nProgress.start();
    // 3. create the payment method via stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      // we are expecting a credit card
      type: 'card',
      // and the card data will come from card element
      card: elements.getElement(CardElement),
    });

    // 4. handle any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return; // stops the checkout
    }
    // 5. send the token from step 3
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    // 6. Change the page to view the order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    // 7. Close the cart
    closeCart();
    // 8. turn the loader off
    setLoading(false);
    nProgress.done();
  };

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
};

const Checkout = () => (
  <Elements stripe={stripeLib}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
