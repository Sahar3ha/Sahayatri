import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

const Test = ({ startCoordinates, endCoordinates }) => {
  console.log('Start Coordinates:', startCoordinates);
  console.log('End Coordinates:', endCoordinates);

  const slat = startCoordinates.latitude || 37.7749;
  const slng = startCoordinates.longitude || -122.4194;
  const elat = endCoordinates.latitude || 34.0522;
  const elng = endCoordinates.longitude || -118.2437;

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9hZHdheW1hbiIsImEiOiJjbGY3ejR3ZjkwYnlrM3NudjJkYzgxcnRtIn0.jdReqoWAgSK93Ruy1iPRSQ';

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${slng},${slat};${elng},${elat}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`
        );

        const routeData = response.data.routes[0];
        const routeGeojson = routeData.geometry;

        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [slng, slat],
          zoom: 12
        });
        map.addControl(new mapboxgl.NavigationControl());

        // Add start and end markers
        new mapboxgl.Marker({ color: 'green' }).setLngLat([slng, slat]).addTo(map);
        new mapboxgl.Marker({ color: 'red' }).setLngLat([elng, elat]).addTo(map);

        // Add the route polyline
        map.on('load', () => {
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: routeGeojson
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': 'blue',
              'line-width': 5
            }
          });
        });
        
        return () => map.remove();
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };

    fetchData();
  }, [slat, slng, elat, elng]);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
};

export default Test;
