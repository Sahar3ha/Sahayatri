import React, { useState } from 'react';
import { createUserApi } from '../apis/Api';
import registerImg from '../images/Register.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import zxcvbn from 'zxcvbn';

const Register = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showStrengthBar, setShowStrengthBar] = useState(false);
  const navigate = useNavigate();

  const changeFirstname = (e) => {
    setFirstName(e.target.value);
  }

  const changeLastname = (e) => {
    setLastname(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const changePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Show strength bar when user starts typing
    setShowStrengthBar(newPassword.length > 0);

    // Check password strength
    const strength = zxcvbn(newPassword).score;
    setPasswordStrength(strength);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordStrength < 2) {
      toast.error('Password is too weak. Please use a stronger password.');
      return;
    }

    const data = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password
    }

    createUserApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigate('/login');
        }
      })
      .catch(err => {
        toast.error("Server error");
        console.error(err.message);
      });
  }

  const renderPasswordStrength = () => {
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

    return (
      <div className="flex items-center mt-2">
        <div className="w-full bg-gray-300 rounded-lg h-2 mr-2">
          <div
            className="h-2 rounded-lg"
            style={{
              width: `${(passwordStrength + 1) * 20}%`,
              backgroundColor: strengthColors[passwordStrength]
            }}
          ></div>
        </div>
        <span style={{ color: strengthColors[passwordStrength] }}>
          {strengthLabels[passwordStrength]}
        </span>
      </div>
    );
  };

  return (
    <div className="flex justify-end h-screen bg-cover bg-center" style={{ backgroundImage: `url(${registerImg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <div className="bg-gray-200 bg-opacity-70 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-6">Sign Up</h2>
        <form className="max-w-[400px] mx-auto">
          <label htmlFor="firstname" className="block text-gray-700">Firstname</label>
          <input onChange={changeFirstname} className="w-full rounded-lg bg-gray-100 mt-2 p-2 focus:outline-none" type="text" id="firstname" placeholder="Enter your firstname" />
          <label htmlFor="lastname" className="block text-gray-700 mt-4">Lastname</label>
          <input onChange={changeLastname} className="w-full rounded-lg bg-gray-100 mt-2 p-2 focus:outline-none" type="text" id="lastname" placeholder="Enter your lastname" />
          <label htmlFor="email" className="block text-gray-700 mt-4">Email</label>
          <input onChange={changeEmail} className="w-full rounded-lg bg-gray-100 mt-2 p-2 focus:outline-none" type="email" id="email" placeholder="Enter your email" />
          <label htmlFor="password" className="block text-gray-700 mt-4">Password</label>
          <input onChange={changePassword} className="w-full rounded-lg bg-gray-100 mt-2 p-2 focus:outline-none" type="password" id="password" placeholder="Enter your password" />
          {showStrengthBar && renderPasswordStrength()}
          <button onClick={handleSubmit} className="w-full mt-6 bg-teal-500 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-teal-600 transition duration-300">Sign Up</button>
          <p className="mt-4 text-center">Already have an account? <a href="/login" className="text-blue-500 underline">Sign in here</a></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
