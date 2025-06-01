import SideMenu from '../components/Layout/SideMenu';
import TableProduct from '../components/TableProduct';

const ProductPage = () => {
  return (
    <div className="flex h-full">
      <SideMenu />
      <div className="flex-1 bg-gray-100">
        <TableProduct />
      </div>
    </div>
  );
};

export default ProductPage;