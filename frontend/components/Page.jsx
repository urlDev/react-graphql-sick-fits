import PropTypes from 'prop-types';
import Header from './Header';

const Page = ({ children }) => (
  <div>
    <Header />
    <h2>I am the page component</h2>
    {children}
  </div>
);

export default Page;

Page.propTypes = {
  children: PropTypes.any,
};
