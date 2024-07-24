import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const RoutingMachineExample = () => {
  const mapRef = useRef();

  useEffect(() => {
    const map = mapRef.current?.leafletElement; // Use optional chaining here
    
    if (map) {
      // Example start and end points
      const startPoint = L.latLng(51.505, -0.09);
      const endPoint = L.latLng(51.51, -0.1);

      // Create the routing control
      L.Routing.control({
        waypoints: [
          L.latLng(startPoint),
          L.latLng(endPoint)
        ],
         routeWhileDragging: true, // Update the route while dragging waypoints
        lineOptions: {
          styles: [{ color: '#3388ff', weight: 20 }],
        },
      }).addTo(map);
    }

  }, [mapRef]);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      whenCreated={(map) => {
        mapRef.current = map; // Set the map reference when it's created
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default RoutingMachineExample;
