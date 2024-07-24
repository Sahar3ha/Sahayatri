import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const Menus = [
    { title: 'Dashboard', src: 'Dashboard', gap: true },
    { title: 'Transports', src: 'Map', gap: true },
    { title: 'Analytics', src: 'Analytics', gap: true },
    { title: 'Logout', src: 'Logout', gap: true },
  ];

  const handleMenuClick = (menu) => {
    if (menu.src === 'Map') {
      navigate('/transport');
    } else if (menu.src === 'Analytics') {
      navigate('/review');
    } else if (menu.src === 'Logout') {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="flex">
      <div
        className={`${
          open ? 'w-72' : 'w-20'
        } duration-200 h-screen pt-8 p-5 bg-cyan-950 relative`}
      >
        <img
          src="./assets/icons/sidebar.png"
          className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 ${
            !open && 'rotate-180'
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && 'scale-0'
            }`}
          >
            Dashboard
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li
              key={index}
              onClick={() => handleMenuClick(menu)}
              className={`text-gray-300 text-sm flex 
                    items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-400 rounded-md ${
                      menu.gap ? 'mt-9' : 'mt-2'
                    }`}
            >
              <img
                className="cursor-pointer top-9 w-6"
                src={`./assets/icons/${menu.src}.png`}
              />
              <span className={`${!open && 'hidden'} origin-left duration-200`}>
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
