import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/Layout/SideMenu';
import TableSimulation from '../components/TableSimulation';

const SimulationPage = () => {
  return (
    <div className="flex h-full">
      <SideMenu />
      <div className="flex-1 bg-gray-100">
        <TableSimulation />
      </div>
    </div>
  );
};

export default SimulationPage;