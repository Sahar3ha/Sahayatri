import './App.css';
import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route
}from 'react-router-dom' 
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Map_Route from './pages/Map_Route';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminTransport from './pages/Admin/AdminTransport';
import AdminRoutes from './pages/Protected/AdminRoutes';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserRoutes from './pages/Protected/UserRoutes';
import ActiveVehicles from './pages/ActiveVehicles';
import RoutingMachineExample from './pages/Lrouting';
import RouteDisplayPage from './pages/RouteView';
import OpenRoute from './pages/OpenRoute';
import UserFeedbackPage from './pages/UserFeedback';
import Profile from './pages/Profile';
import Reviews from './pages/Admin/Reviews';
import ShowLocation from './pages/ShowLocation';
import Polyline from './components/MapwithPolyline';
import MapDisplay from './components/MapDisplay';
import Location from './pages/ShowLocation';
import AdminEditTransport from './pages/Admin/AdminEditTransport';
import NotificationPage from './pages/notification';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UpdateProfile from './pages/UpdateProfile';

function App() {

  
  return (
    <Router>

      <ToastContainer/>
      <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/map' element={<Map_Route/>}/>
      <Route path='/userTransport' element={<ActiveVehicles/>}/>

        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}/>
        
        <Route element={<UserRoutes/>}>

          <Route path='/home' element={<Dashboard/>}/>
          <Route path='/map' element={<Map_Route/>}/>
          <Route path='/userTransport' element={<ActiveVehicles/>}/>
          <Route path='/user/view/:id' element={<RouteDisplayPage/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/updateProfile' element={<UpdateProfile/>}/>

          <Route path='/notification' element={<NotificationPage/>}/>

          <Route path='/user/userFeedback/:id' element={<UserFeedbackPage/>}/>
        </Route>
        <Route path='/openstreet' element={<MapDisplay/>}/>
        <Route path='/loc' element={<Location/>}/>

        <Route path='/try' element={<OpenRoute/>}/>
        <Route path='/poly' element={<Polyline/>}/>
        <Route element={<AdminRoutes/>}>
        <Route path='/adminDashboard' element={<AdminDashboard/>}/>
          <Route path='/transport' element={<AdminTransport/>}/>
          <Route path='/lroute' element={<RoutingMachineExample/>}/>
          <Route path='/review' element= {<Reviews/>}/>
          <Route path='/admin/editTransport/:id' element={<AdminEditTransport/>}/>
        </Route>

        <Route path='/showl' element={<ShowLocation/>}/>

          
        
      </Routes>
      <Footer/>

    </Router>
  );
}

export default App;
