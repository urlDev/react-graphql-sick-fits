import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits';

const sessionConfig = {
  // How long should they stay signed in
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  // User logs in
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: add in initial roles here
  },
  // adding this gives us a new mutation method
  // to be able to send a reset password link
  passwordResetLink: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async sendToken(args) {
      console.log(args);
    },
  },
});

// Keystone config
// wrapping it with auth
export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('connecting to the db');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items here
      User,
      Product,
      ProductImage,
    }),
    // to show the keystone ui or not
    ui: {
      // Todo: change this for roles
      // keystone expects a function here returns boolean
      // show the ui only for people who pass this test
      isAccessAllowed: ({ session }) => !!session?.data,
    },

    session: withItemData(statelessSessions(sessionConfig), {
      // this is graphQL query actually
      User: 'id name email',
    }),
  })
);
