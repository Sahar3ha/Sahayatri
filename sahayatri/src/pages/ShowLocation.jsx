import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Location = () => {
  const startPoint = [85.315917, 27.717036]; // San Francisco coordinates
  const endPoint = [85.321123, 27.695785]; // Los Angeles coordinates

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9hZHdheW1hbiIsImEiOiJjbGY3ejR3ZjkwYnlrM3NudjJkYzgxcnRtIn0.jdReqoWAgSK93Ruy1iPRSQ';

    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: startPoint, // starting position [lng, lat]
      zoom: 6 // starting zoom
    });

    // Add navigation control (zoom buttons)
    map.addControl(new mapboxgl.NavigationControl());

    // Add markers for start and end points with custom color
    new mapboxgl.Marker({ color: 'green' }) // Change the color to green
      .setLngLat(startPoint)
      .addTo(map);

    new mapboxgl.Marker({ color: 'red' }) // Change the color to red
      .setLngLat(endPoint)
      .addTo(map);

    // Fetch driving route
    fetchRoute(startPoint, endPoint, map);

    return () => map.remove(); // Clean up the map on unmount
  }, []);

  const fetchRoute = async (start, end, map) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const route = data.routes[0].geometry;
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#296BC2', // Light blue color
          'line-width': 5
        }
      });

    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default Location;
