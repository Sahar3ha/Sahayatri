import React from 'react';
import dashboardImg from '../images/main_thumbnail.svg';
import '../style/dashboard.css';
import { Link } from "react-router-dom";
import Example from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <>
      <Example/>
      <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
        <div className='sm:ml-40 mt-20 justify-center text-center sm:text-left'> 
          <h1 className='text-4xl sm:text-5xl font-bold text-gray-800'>SAHAYATRI</h1>
          <p className='text-lg sm:text-xl text-gray-600 mt-4'>
            A web and mobile based application designed to help people find their way
          </p>
        </div>
        <div className='mt-10 flex justify-center'>
          <img src={dashboardImg} alt="Dashboard" />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mt-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sign up as a commuter:</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="bg-gray-200 rounded-md p-6 flex items-center flex-col">
              <div className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center">
                <div className="bg-gray-400 rounded-full h-6 w-6"></div>
              </div>
              <h3 className="text-lg font-semibold mt-4">Feedback</h3>
              <p className="text-gray-600 mt-2 text-center">Leave your review on specific public transit routes</p>
            </div>
            <div className="bg-gray-200 rounded-md p-6 flex items-center flex-col">
              <div className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center">
                <div className="bg-gray-400 rounded-full h-6 w-6"></div>
              </div>
              <h3 className="text-lg font-semibold mt-4">Notifications</h3>
              <p className="text-gray-600 mt-2 text-center">Receive regular email notifications about changes to your favorite routes</p>
            </div>
            <div className="bg-gray-200 rounded-md p-6 flex items-center flex-col">
              <div className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center">
                <div className="bg-gray-400 rounded-full h-6 w-6"></div>
              </div>
              <h3 className="text-lg font-semibold mt-4">Up-to-date</h3>
              <p className="text-gray-600 mt-2 text-center">Be updated about routes in your city in just 2 minutes</p>
            </div>
            <div className="bg-gray-200 rounded-md p-6 flex items-center flex-col">
              <div className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center">
                <div className="bg-gray-400 rounded-full h-6 w-6"></div>
              </div>
              <h3 className="text-lg font-semibold mt-4">Unique profile</h3>
              <p className="text-gray-600 mt-2 text-center">Create your profile and become an expert in public transit</p>
            </div>
            <div className="bg-gray-200 rounded-md p-6 flex items-center flex-col">
              <div className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center">
                <div className="bg-gray-400 rounded-full h-6 w-6"></div>
              </div>
              <h3 className="text-lg font-semibold mt-4">Add your ideas</h3>
              <p className="text-gray-600 mt-2 text-center">Suggest your ideas how to improve public transit in your city and review other people's ideas</p>
            </div>
          </div>
        </div>
      </div>
      <div className=' m-28'>
      </div>
    </>
  )
}

export default Dashboard;
