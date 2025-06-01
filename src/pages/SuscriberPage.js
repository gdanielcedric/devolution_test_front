import SideMenu from '../components/Layout/SideMenu';
import TableSuscriber from '../components/TableSuscriber';

const SuscriberPage = () => {
  return (
    <div className="flex h-full">
      <SideMenu />
      <div className="flex-1 bg-gray-100">
        <TableSuscriber />
      </div>
    </div>
  );
};

export default SuscriberPage;