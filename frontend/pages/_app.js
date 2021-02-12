/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
// NProgress helps us show a progress/loading bar when page loads
import NProgress from 'nprogress';
import Router from 'next/router';
import Page from '../components/Page';

// Applying custom nprogress styles
import '../components/styles/nprogress.css';

// Hooking NProgress with next js router. NProgress will know
// when to begin showing the bar and when to end it
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// This component is to control the pages
// Component and pageProps are for NextJs to understand
const MyApp = ({ Component, pageProps }) => (
  <Page>
    <Component {...pageProps} />
  </Page>
);

export default MyApp;
