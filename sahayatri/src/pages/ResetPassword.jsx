import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../apis/Api';
// import ResetPasswordImg from '../images/ResetPasswordImg.jpg';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    resetPasswordApi({ token, password })
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          toast.success('Password reset successful! Please login with your new password.');
          navigate('/login');
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('Error:', err); // Log the error details
        toast.error('Server Error');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover" style={{ backgroundImage: `url(})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-gray-100 p-8 rounded-lg shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(5px)' }}>
        <h2 className="text-4xl font-bold text-center mb-6">Reset Password</h2>
        <form className="max-w-[400px] mx-auto" onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">New Password</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} className="w-full rounded-lg bg-gray-200 py-2 px-4 focus:outline-none" required />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm New Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className="w-full rounded-lg bg-gray-200 py-2 px-4 focus:outline-none" required />
          </div>
          <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
