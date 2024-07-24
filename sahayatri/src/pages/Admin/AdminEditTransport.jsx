import { getSingleVehicleApi, updateVehicleApi } from "../../apis/Api";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminEditTransport = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Fix: Add useNavigate hook
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: "Dashboard", src: "Dashboard", gap: true },
    { title: "Transports", src: "Map", gap: true },
    { title: "Analytics", src: "Analytics", gap: true }, // Fix: Corrected spelling
    { title: "Logout", src: "Logout", gap: true },
  ];

  useEffect(() => {
    getSingleVehicleApi(id).then((res) => {
      console.log(res.data);
      setVehicleName(res.data.vehicle.vehicleName);
      setFrom(res.data.vehicle.from);
      setTo(res.data.vehicle.to);
    });
  }, [id]);

  const [vehicleName, setVehicleName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("vehicleName", vehicleName);
    formData.append("from", from);
    formData.append("to", to);

    updateVehicleApi(id, formData)
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("Server error!");
        console.log(err.message);
      });
  };
  const handleMenuClick = (menu) => {
    if (menu.src === "Map") {
      navigate("/transport");
    } else if (menu.src === "Analytics") {
      // Fix: Corrected comparison operator
      navigate("/review");
    } else if (menu.src === "Logout") {
      // Fix: Corrected comparison operator
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } duration-200 h-screen pt-8 p-5 bg-gray-900 text-white relative`}
      >
        <img
          src="./assets/icons/sidebar.png"
          className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
          alt="Sidebar"
        />
        <div className="flex gap-x-4 items-center">
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Dashboard
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li
              key={index}
              onClick={() => handleMenuClick(menu)}
              className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md ${
                menu.gap ? "mt-9" : "mt-2"
              }`}
            >
              <img
                className="cursor-pointer top-9 w-6"
                src={`../assets/icons/${menu.src}.png`}
                alt={menu.title}
              />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-auto p-7 text-2xl font-semibold h-screen">
        <div className="mt-12">
          <form className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
            <div className="mb-4">
              <label
                htmlFor="vehicleName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Vehicle Name
              </label>
              <input
                onChange={(e) => setVehicleName(e.target.value)}
                value={vehicleName}
                type="text"
                id="vehicleName"
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter Vehicle Name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="from"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Path (From)
              </label>
              <input
                onChange={(e) => setFrom(e.target.value)}
                value={from}
                type="text"
                id="from"
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="From"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="to"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Path (To)
              </label>
              <input
                onChange={(e) => setTo(e.target.value)}
                value={to}
                type="text"
                id="to"
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="To"
              />
            </div>

            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded text-xl"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditTransport;
