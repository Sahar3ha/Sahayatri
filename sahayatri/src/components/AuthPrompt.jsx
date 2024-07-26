import React from 'react';
import { Link } from 'react-router-dom';

const AuthPromptModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md shadow-md max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-2xl mb-4">You need to register or log in</h2>
        <p className="mb-4">Please register or log in to add vehicles to your favourites or view vehicle details.</p>
        <div className="flex justify-end">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
            Login
          </Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-md">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
