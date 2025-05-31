import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/Layout/SideMenu';
import AddSimulation from '../components/AddSimulation';

const AddSimulationPage = () => {
  return (
    <div className="flex h-full">
      <SideMenu />
      <div className="flex-1 bg-gray-100">
        <AddSimulation />
      </div>
    </div>
  );
};

export default AddSimulationPage;