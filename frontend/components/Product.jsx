/* eslint-disable react/prop-types */

import Link from 'next/link';
import PriceTag from './styles/PriceTag';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import formatMoney from '../lib/formatMoney';

const Product = ({ product }) => (
  <ItemStyles>
    {/* nested chain. putting ? means check if theres product, if yes, continue */}
    <img src={product?.photo?.image?.publicUrlTransformed} alt={product.name} />
    <Title>
      <Link href={`/product/${product.id}`}>{product.name}</Link>
    </Title>
    <PriceTag>{formatMoney(product.price)}</PriceTag>
    <p>{product.description}</p>
    {/* ToDo add buttons to add and delete items */}
  </ItemStyles>
);

export default Product;
