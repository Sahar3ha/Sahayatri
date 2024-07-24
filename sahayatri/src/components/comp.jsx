import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const LocationFinder = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (originCoordinates && destinationCoordinates) {
      calculateRoute();
    }
  }, [originCoordinates, destinationCoordinates]);

  const calculateRoute = async () => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${originCoordinates.longitude},${originCoordinates.latitude};${destinationCoordinates.longitude},${destinationCoordinates.latitude}?overview=false&alternatives=false`
      );
  
      if (response.data.routes.length > 0) {
        const { geometry } = response.data.routes[0];
        setRoute(L.Polyline.fromEncoded(geometry).getLatLngs());
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };
  

  const handleFindCoordinates = async () => {
    try {
      // Fetch coordinates for origin
      const originResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`
      );

      if (originResponse.data.length > 0) {
        const { lat, lon } = originResponse.data[0];
        setOriginCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      } else {
        console.error('No results found for the origin location.');
        setOriginCoordinates(null);
      }

      // Fetch coordinates for destination
      const destinationResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`
      );

      if (destinationResponse.data.length > 0) {
        const { lat, lon } = destinationResponse.data[0];
        setDestinationCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      } else {
        console.error('No results found for the destination location.');
        setDestinationCoordinates(null);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOriginCoordinates(null);
      setDestinationCoordinates(null);
    }
  };

  return (
    <div>
      <h2>Location Finder</h2>
      <div>
        <label>Origin Location:</label>
        <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
      </div>
      <div>
        <label>Destination Location:</label>
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
      </div>
      <button onClick={handleFindCoordinates}>Find Coordinates</button>

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {originCoordinates && (
          <Marker position={[originCoordinates.latitude, originCoordinates.longitude]}>
            <Popup>Origin: {origin}</Popup>
          </Marker>
        )}

        {destinationCoordinates && (
          <Marker position={[destinationCoordinates.latitude, destinationCoordinates.longitude]}>
            <Popup>Destination: {destination}</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline positions={route} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationFinder;
