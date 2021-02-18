/* eslint-disable react/prop-types */
import Link from 'next/link';
import PriceTag from './styles/PriceTag';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import formatMoney from '../lib/formatMoney';
import DeleteProduct from './DeleteProduct';

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
    <div className="buttonList">
      <Link
        // creating a pathname and query for nextJs
        href={{
          pathname: 'update',
          query: {
            id: product.id,
          },
        }}
      >
        Edit ✏️
      </Link>
      <DeleteProduct id={product.id}>Delete</DeleteProduct>
    </div>
  </ItemStyles>
);

export default Product;
