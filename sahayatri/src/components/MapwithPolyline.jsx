import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Test = () => {
  // Static coordinates
  const startCoordinates = {
    latitude: 40.7128,  // New York City
    longitude: -74.0060
  };
  const endCoordinates = {
    latitude: 34.0522,  // Los Angeles
    longitude: -118.2437
  };

  // Initial viewport settings
  const viewport = {
    latitude: 37.7749, // San Francisco (central location for the map)
    longitude: -122.4194,
    zoom: 4
  };

  return (
    <div className="h-40">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken="pk.eyJ1Ijoicm9hZHdheW1hbiIsImEiOiJjbGY3ejVidHAxbDBtM3RvMTVic3k2a29rIn0.W6B661K42DbFzFa4bfndkA"
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker latitude={startCoordinates.latitude} longitude={startCoordinates.longitude} offsetLeft={-20} offsetTop={-10}>
          <div>Start</div>
        </Marker>
        <Marker latitude={endCoordinates.latitude} longitude={endCoordinates.longitude} offsetLeft={-20} offsetTop={-10}>
          <div>End</div>
        </Marker>
      </ReactMapGL>
    </div>
  );
};

export default Test;
