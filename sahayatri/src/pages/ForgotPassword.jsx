import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPasswordApi } from '../apis/Api';
import { Link } from 'react-router-dom';
// import ForgotPasswordImg from '../images/ForgotPasswordImg.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    forgotPasswordApi({ email })
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          toast.success("Password reset link has been sent to your email.");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('Error:', err); // Log the error details
        toast.error("Server Error");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover" style={{ backgroundImage: `url()`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-gray-100 p-8 rounded-lg shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(5px)' }}>
        <h2 className="text-4xl font-bold text-center mb-6">Forgot Password</h2>
        <form className="max-w-[400px] mx-auto" onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={handleEmailChange} className="w-full rounded-lg bg-gray-200 py-2 px-4 focus:outline-none" required />
          </div>
          <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="mt-4 text-center">Remember your password? <Link to="/login" className="text-blue-500 underline">Login here</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
