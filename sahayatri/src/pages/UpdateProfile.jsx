import React, { useState } from 'react';
import { updateProfileApi } from '../apis/Api'; // Assuming you have an API function for updating profile
import { useNavigate } from 'react-router-dom';
import Example from '../components/Navbar';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
  const storedUserData = localStorage.getItem('user');
  const parsedUserData = JSON.parse(storedUserData);
  const userId = parsedUserData._id;
  const [firstName, setFirstName] = useState(parsedUserData.firstName);
  const [lastName, setLastName] = useState(parsedUserData.lastName);
  const [email, setEmail] = useState(parsedUserData.email);
  const navigate = useNavigate();

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const data = {
      userId,
      firstName,
      lastName,
      email
    };

    try {
      const res = await updateProfileApi(data);
      if (res.data.success) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Profile updated successfully!');
        navigate('/profile');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <>
      <Example />
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-6">Update Profile</h2>
          <form onSubmit={handleUpdateProfile} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
                className="w-full rounded-lg bg-gray-200 py-2 px-4 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
                className="w-full rounded-lg bg-gray-200 py-2 px-4 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full rounded-lg bg-gray-200 py-2 px-4 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
