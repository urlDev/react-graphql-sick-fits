/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { Session } from '../types';

interface Arguments {
  token: string;
}

const graphql = String.raw;

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order');
  }

  // 1.5 query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`id
     name 
     email 
     cart {
         id
         quantity
         product {
             name
             price
             description
             id
             photo {
                 id
                 image {
                     id
                     publicUrlTransformed
                 }
             }
         }
     }`,
  });

  // 2. Calculate the total price
  // filtering the cart based on if the cart item has a product related to it
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(
    (tally: number, cartItem: CartItemCreateInput) =>
      tally + cartItem.quantity * cartItem.product.price,
    0
  );

  // 3. Create the charge in stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });

  // 4.Convert the cartItems to orderItems
  const orderItems = cartItems.map((cartItem) => {
    const { name, description, price, photo } = cartItem.product;
    const orderItem = {
      name,
      description,
      price,
      quantity: cartItem.quantity,
      photo: {
        connect: { id: photo.id },
      },
    };

    return orderItem;
  });
  // 5. Crete the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  // clean up any old cart item
  const cartItemIds = cartItems.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  return order;
}

export default checkout;
