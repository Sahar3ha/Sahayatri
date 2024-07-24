import feedback from "../images/icons/feedback.png";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createFavourtieApi, getActivatedVehiclesApi } from "../apis/Api";
import favIcon from "../images/icons/fav.png";
import favIconActive from "../images/icons/added.png";
import Example from "../components/Navbar";

const ActiveVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [activeIcons, setActiveIcons] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  console.log(vehicles);
  useEffect(() => {
    getActivatedVehiclesApi().then((res) => {
      setVehicles(res.data.vehicles);

      const initialActiveIcons = {};
      res.data.vehicles.forEach((item) => {
        initialActiveIcons[item._id] = false;
      });
      setActiveIcons(initialActiveIcons);
    });
  }, []);

  useEffect(() => {
    const filtered = vehicles.filter((item) =>
      item.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [searchQuery, vehicles]);

  const toggleIcon = (id) => {
    setActiveIcons((prevIcons) => ({
      ...prevIcons,
      [id]: !prevIcons[id],
    }));
  };

  const handleAdd = (e, vehicleId) => {
    e.preventDefault();

    const storedUserData = localStorage.getItem("user");

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      const userId = parsedUserData._id;

      const data = {
        userId: userId,
        vehicleId: vehicleId,
      };

      createFavourtieApi(data)
        .then((res) => {
          if (res.data.success === false) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          toast.error("Server error");
          console.log(err.message);
        });
    } else {
      console.log("User data not found in localStorage");
    }
  };

  return (
    <>
      <Example />
      <div className="container mx-auto my-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredVehicles.map((item) => (
            <div
              key={item._id}
              className="relative bg-white border shadow-md rounded-md p-4 transition-all duration-300"
            >
              <Link
                to={`/user/view/${item._id}`}
                className="text-lg font-semibold block hover:text-blue-500"
              >
                {item.vehicleName || ""}
              </Link>
              <p className="text-gray-600">{`From: ${item.from || ""}`}</p>
              <p className="text-gray-600">{`To: ${item.to || ""}`}</p>
              <div className="flex justify-end">
                <button
                  className="text-white p-2 rounded-full bg-blue-500 mr-2"
                  onClick={(e) => {
                    toggleIcon(item._id);
                    handleAdd(e, item._id);
                  }}
                >
                  <img
                    src={activeIcons[item._id] ? favIconActive : favIcon}
                    alt="Favorite Icon"
                    className="w-full h-auto max-h-6 max-h-xs"
                  />
                </button>
                <button className="text-white p-2 rounded-full bg-green-500">
                  <Link to={`/user/userfeedback/${item._id}`}>
                    <img
                      src={feedback}
                      alt="Feedback Icon"
                      className="w-full h-auto max-h-6 max-h-xs"
                    />
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActiveVehicles;
