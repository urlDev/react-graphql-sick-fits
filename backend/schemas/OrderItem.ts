import { integer, relationship, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const OrderItem = list({
  // Todo
  // access:

  fields: {
    name: text({ isRequired: true }),
    description: text({
      // ui will define here how we want to see the
      // description area
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      // making a connection between image and product
      // referencing productImages product
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    price: integer(),
    quantity: integer(),
    order: relationship({ ref: 'Order.items' }),
  },
});
