import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/Layout/SideMenu';
import AddSubscription from '../components/AddSubscription';

const AddSubscriptionPage = () => {
  return (
    <div className="flex h-full">
      <SideMenu />
      <div className="flex-1 bg-gray-100">
        <AddSubscription />
      </div>
    </div>
  );
};

export default AddSubscriptionPage;