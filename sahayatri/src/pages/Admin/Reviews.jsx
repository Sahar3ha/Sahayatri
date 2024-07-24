import React, { useEffect, useState } from 'react';
import { getFeedbackApi } from '../../apis/Api';
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFeedbackApi()
      .then((res) => {
        setReviews(res.data.reviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error.message);
      });
  }, []);

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

  const Menus = [
    { title: "Dashboard", src: "Dashboard", gap: true },
    { title: "Transports", src: "Map", gap: true },
    { title: "Analytics", src: "Analytics", gap: true },
    { title: "Logout", src: "Logout", gap: true },
  ];

  return (
    <div className="flex">
      <div className="w-72 duration-200 h-screen pt-8 p-5 bg-gray-900 relative">
        <div className="flex gap-x-4 items-center">
          <h1 className="text-white origin-left font-medium text-xl duration-200">Dashboard</h1>
        </div>
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li
              key={index}
              onClick={() => handleMenuClick(menu)}
              className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-400 rounded-md ${menu.gap ? 'mt-9' : 'mt-2'}`}
            >
              <img className="cursor-pointer top-9 w-6" src={`./assets/icons/${menu.src}.png`} alt={menu.title} />
              <span className="origin-left duration-200">{menu.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-center items-center w-full p-8">
        <h2 className="text-3xl font-bold mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews available.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-md shadow-md">
                <p className="text-gray-800">{review.feedback}</p>
                <p className="text-gray-600 mt-2">Vehicle: {review.vehicleId.vehicleName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
