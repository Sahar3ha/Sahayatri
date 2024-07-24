import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapDisplay = () => {
  const from = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco coordinates
  const to = { latitude: 34.0522, longitude: -118.2437 }; // Los Angeles coordinates

  const mapRef = useRef(null); // Create a ref for the map container

  useEffect(() => {
    // Define static coordinates for the route
    const staticRouteCoordinates = [
      [from.latitude, from.longitude],
      [to.latitude, to.longitude]
    ];

    // Draw the polyline on the map
    const polyline = L.polyline(staticRouteCoordinates, { color: 'blue' });

    // Get the Leaflet map instance from the mapRef
    const mapInstance = mapRef.current && mapRef.current.leafletElement;

    // Check if mapInstance is not null before adding the polyline
    if (mapInstance) {
      polyline.addTo(mapInstance);
    }
  }, []);

  return (
    <MapContainer center={[from.latitude, from.longitude]} zoom={6} style={{ height: '500px', width: '100%' }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapDisplay;
