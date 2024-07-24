import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Map } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const markerIcon = new L.Icon({
    iconUrl : require("../images/icons/location.png"),
    iconSize : [35,32]
  })
const MapWithPolyline = () => {
  const [map, setMap] = useState(null);
  const [routeControl, setRouteControl] = useState(null);
  const [waypoints, setWaypoints] = useState([
    { lat: 51.505, lng: -0.09 },  
    { lat: 51.51, lng: -0.1 },   // End point
  ]);

  
  useEffect(() => {
    if (map && waypoints.length > 1) {
      const control = L.Routing.control({
        waypoints: waypoints.map(({ lat, lng }) => L.latLng(lat, lng)),
        routeWhileDragging: true,
      }).addTo(map);

      setRouteControl(control);
    }
  }, [map, waypoints]);

  return (
    <MapContainer

      center={[27.705006144032264, 85.33119689404717]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      whenCreated={(mapInstance) => setMap(mapInstance)}
    >
        
      <TileLayer
        url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=kO3sALnaBWgi7Zixpm3d"
        attribution='&copy; <a href="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=kO3sALnaBWgi7Zixpm3d">OpenStreetMap</a> contributors'
      />

      {/* Markers for start and end points */}
      {waypoints.map((coords, index) => (
        
        <Marker icon={markerIcon}key={index} position={[coords.lat, coords.lng]}>
          <Popup>{`Point ${index + 1}`}</Popup>
        </Marker>
      ))}
      
    </MapContainer>
  );
};

export default MapWithPolyline;
