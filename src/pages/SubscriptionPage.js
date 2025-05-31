import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/Layout/SideMenu';
import TableSubscription from '../components/TableSubscription';

const SubscriptionPage = () => {
  return (
    <div className="flex h-full">
      <SideMenu />
      <div className="flex-1 bg-gray-100">
        <TableSubscription />
      </div>
    </div>
  );
};

export default SubscriptionPage;