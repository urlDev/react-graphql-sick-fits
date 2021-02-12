import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';

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
      // Todo: Add data seeding here
    },
    lists: createSchema({
      // Schema items here
      User,
    }),
    // to show the keystone ui or not
    ui: {
      // Todo: change this for roles
      // keystone expects a function here returns boolean
      // show the ui only for people who pass this test
      isAccessAllowed: ({ session }) => {
        console.log(session);
        return !!session?.data;
      },
    },

    session: withItemData(statelessSessions(sessionConfig), {
      // this is graphQL query actually
      User: 'id name email',
    }),
  })
);