import React, { useState, useEffect } from 'react';
import Map from '../components/Test';
import { Link } from 'react-router-dom';
import Test from '../components/Test';
import axios from 'axios'; // Import axios
import Example from '../components/Navbar';

const Map_Route = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);

  const handleGetDirection = async (e) => {
    e.preventDefault();
    await geocodeLocation(location, setStartCoordinates);
    await geocodeLocation(destination, setEndCoordinates);
  };

  const geocodeLocation = async (location, setCoordinates) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1Ijoicm9hZHdheW1hbiIsImEiOiJjbGY3ejR3ZjkwYnlrM3NudjJkYzgxcnRtIn0.jdReqoWAgSK93Ruy1iPRSQ`
      );

      if (response.data.features.length > 0) {
        const coordinates = response.data.features[0].center;
        setCoordinates(coordinates);
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  };

  return (
    <>
    <Example/>
    <div className="bg-gray-200 min-h-screen p-4">
      <Link to="/userTransport">
        <div className="py-2 px-4 mb-4 bg-gray-400 rounded-md cursor-pointer hover:bg-gray-500 transition-all duration-300">
          <span className="text-white">Active Routes and Vehicles</span>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4 bg-white rounded-md shadow-md">
        <div className="space-y-4">
          <div className="bg-slate-300 p-2 rounded-lg">
            <input
              className="w-full text-xl bg-transparent outline-none"
              type="text"
              placeholder="Your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="bg-slate-300 p-2 rounded-lg">
            <input
              className="w-full text-xl bg-transparent outline-none"
              type="text"
              placeholder="Your Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="py-3 px-7 rounded-lg">
            <button
              onClick={handleGetDirection}
              className="w-full bg-gray-300 text-black px-4 py-2 rounded-md shadow-md hover:bg-green-500 hover:text-white transition-all duration-300 focus:outline-none"
            >
              <span>Get Direction</span>
            </button>
          </div>
        </div>

        <div className="map-container">
          {startCoordinates && endCoordinates && (
            <Test startCoordinates={{ latitude: startCoordinates[1], longitude: startCoordinates[0] }} endCoordinates={{ latitude: endCoordinates[1], longitude: endCoordinates[0] }} />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Map_Route;
