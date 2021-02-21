import { integer, relationship, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  // Todo
  // access:

  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: (item) => {
        // wrote a virtual label to show instead of id
        return `${formatMoney(item.total)}`
      }
    })
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
