import React, { useEffect, useState } from 'react';
import { getFavouriteApi, deleteFavouriteApi } from '../apis/Api'; // Assuming you have an API function for deleting favorites
import Example from '../components/Navbar';

const Profile = () => {
  const [favourites, setFavourites] = useState([]);
  const storedUserData = localStorage.getItem('user');
  const parsedUserData = JSON.parse(storedUserData);
  const userId = parsedUserData._id;
  const { firstName, lastName, email } = parsedUserData; 

  useEffect(() => {
    getFavouriteApi(userId).then((res) => {
      setFavourites(res.data.favourites);
    });
  }, [userId]); 

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      await deleteFavouriteApi(favoriteId);
      // Remove the deleted favorite from the state
      setFavourites((prevFavourites) =>
        prevFavourites.filter((fav) => fav._id !== favoriteId)
      );
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  return (
    <>
    <Example/>
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-3xl font-semibold mb-6">Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <p className="text-lg font-semibold">{`${firstName} ${lastName}`}</p>
          <p className="text-gray-600">{email}</p>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Favourites</h3>
        </div>

        <div>
          {favourites.map((item) => (
            <div
              key={item._id}
              className="bg-white border shadow-md rounded-md p-4 mb-4 flex justify-between items-center"
            >
              <p className="text-gray-600 font-semibold">{item.vehicleId.vehicleName}</p>
              <button
                className="text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => handleDeleteFavorite(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
