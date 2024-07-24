import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSingleVehicleApi } from "../apis/Api";
import Test from "../components/Test";
import "mapbox-gl/dist/mapbox-gl.css";
import Example from "../components/Navbar";

const RouteDisplayPage = () => {
  const { id } = useParams();
  const [vehicleName, setVehicleName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [toCoordinates, setToCoordinates] = useState(null);
  const [fetchedFromCoordinates, setFetchedFromCoordinates] = useState([]);
  const [fetchedToCoordinates, setFetchedToCoordinates] = useState([]);

  useEffect(() => {
    getSingleVehicleApi(id).then((res) => {
      console.log(res.data);
      setVehicleName(res.data.vehicle.vehicleName);
      setFrom(res.data.vehicle.from);
      setTo(res.data.vehicle.to);

      fetchCoordinates(res.data.vehicle.from, setFromCoordinates, setFetchedFromCoordinates);
      fetchCoordinates(res.data.vehicle.to, setToCoordinates, setFetchedToCoordinates);
    });
  }, [id]);

  const fetchCoordinates = (place, setCoordinates, setFetchedCoordinates) => {
    const accessToken = "pk.eyJ1Ijoicm9hZHdheW1hbiIsImEiOiJjbGY3ejVidHAxbDBtM3RvMTVic3k2a29rIn0.W6B661K42DbFzFa4bfndkA";
    const mapboxGeocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${accessToken}`;

    fetch(mapboxGeocodingEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          const coordinates = { latitude, longitude };
          setCoordinates(coordinates);
          setFetchedCoordinates && setFetchedCoordinates(coordinates);
        } else {
          console.error("No coordinates found for:", place);
        }
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  };

  return (
    <>
      <Example />
      <div className="bg-gray-200 min-h-screen p-4">
        <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>

        <div className="mb-4">
          <p>
            <strong>Vehicle Name:</strong> {vehicleName}
          </p>
          <p>
            <strong>From:</strong> {from}
          </p>
          <p>
            <strong>To:</strong> {to}
          </p>
        </div>

        {fetchedFromCoordinates && fetchedToCoordinates && (
          <Test startCoordinates={fetchedFromCoordinates} endCoordinates={fetchedToCoordinates} />
        )}

        <Link to="/active-vehicles" className="inline-block underline text-blue-500">
          Back to Active Vehicles
        </Link>
      </div>
    </>
  );
};

export default RouteDisplayPage;
