/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import Page from '../components/Page';

// This component is to control the pages
// Component and pageProps are for NextJs to understand
const MyApp = ({ Component, pageProps }) => (
  <Page>
    <Component {...pageProps} />
  </Page>
);

export default MyApp;
