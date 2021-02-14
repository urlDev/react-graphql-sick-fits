// This file will match with the products details

import SingleProduct from '../../components/SingleProduct';

// because of how we named the file with square brackets
const SingleProductPage = ({ query }) => <SingleProduct id={query.id} />;

export default SingleProductPage;
