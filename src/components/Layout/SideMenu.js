import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UsersIcon, ArchiveIcon, } from '@heroicons/react/solid';

const SideMenu = () => {
  const location = useLocation(); // Obtenir la route actuelle
  const user = JSON.parse(sessionStorage.getItem('user')); // Récupérer les infos utilisateur de sessionStorage
  const role = user?.role;

  const menuItems = [
    { name: 'Simulations', path: '/simulations', icon: <UsersIcon className="h-6 w-6" style={{display:'unset'}} /> },
    { name: 'Subscriptions', path: '/subscriptions', icon: <UsersIcon className="h-6 w-6" style={{display:'unset'}} /> },
    { name: 'Suscribers', path: '/suscribers', icon: <UsersIcon className="h-6 w-6" style={{display:'unset'}} /> },
    { name: 'Products', path: '/products', icon: <ArchiveIcon className="h-6 w-6" style={{display:'unset'}} /> },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <nav className="flex flex-col mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={`p-4 text-lg hover:bg-gray-700 ${
              location.pathname === item.path ? 'bg-gray-700 font-bold' : ''
            }`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideMenu;