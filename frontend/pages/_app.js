/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
// NProgress helps us show a progress/loading bar when page loads
import NProgress from 'nprogress';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';
import Page from '../components/Page';

// Applying custom nprogress styles
import '../components/styles/nprogress.css';
import withData from '../lib/withData';

// Hooking NProgress with next js router. NProgress will know
// when to begin showing the bar and when to end it
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// This component is to control the pages
// Component and pageProps are for NextJs to understand
const MyApp = ({ Component, pageProps, apollo }) => (
  <ApolloProvider client={apollo}>
    <Page>
      <Component {...pageProps} />
    </Page>
  </ApolloProvider>
);

// telling next js to get all the queries for children components
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  // getting queries in a page level
  // /products/2 -> and getting this part
  pageProps.query = ctx.query;

  return { pageProps };
};

// wrapping app with withData so we can have apollo client
export default withData(MyApp);
