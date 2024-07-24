import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createVehicleApi, getAllVehicleApi, deleteVehicleApi, activationApi, deactivationApi, create_notification } from '../../apis/Api';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminTransport = () => {
  const navigate = useNavigate()

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    getAllVehicleApi().then((res) => {
      setVehicles(res.data.vehicles);
      setTotalItems(res.data.vehicles.length);
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [open, setOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const Menus = [
    { title: "Dashboard", src: "Dashboard", gap: true },
    { title: "Transports", src: "Map", gap: true },
    { title: "Analystics", src: "Analytics", gap: true },
    { title: "Logout", src: "Logout", gap: true },
  ];

  const [vehicleName, setVehicleName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    getAllVehicleApi().then((res) => {
      setVehicles(res.data.vehicles);
    });
  }, []);

  useEffect(() => {
    const filtered = vehicles.filter((item) =>
      item.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [searchQuery, vehicles]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      vehicleName: vehicleName,
      from: from,
      to: to,
    };

    createVehicleApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("Server Error");
        console.log(err.message);
      });
  };

  const handleAddVehicleClick = () => {
    setShowForm(!showForm);
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDialog) {
      return;
    } else {
      deleteVehicleApi(id).then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          window.location.reload();
        } else {
          toast.error(res.data.message);
        }
      });
    }
  };

  const handleActivation = (id, activate) => {
    const apiFunction = activate ? activationApi : deactivationApi;
    
    apiFunction(id)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          window.location.reload();
          // Create notification after activation/deactivation
          create_notification(id)
            .then((res) => {
              if (res.data.success) {
                // Notification created successfully
              } else {
                // Notification creation failed
                console.error(res.data.message);
              }
            })
            .catch((notificationErr) => {
              // Error handling for notification creation
              console.error('Error creating notification:', notificationErr.message);
            });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error('Server Error');
        console.log(err.message);
      });
  };

  const handleMenuClick = (menu) => {
    if (menu.src === 'Map') {
      navigate('/transport');
    }else if (menu.src == 'Analytics') {
        navigate('/review')
    }else if(menu.src == 'Logout'){
        localStorage.clear()
        navigate('/login')
    }else if(menu.src == 'Analytics'){
      localStorage.clear()
      navigate('/review')
  }
  };

  return (
    <div className="flex">
      <div className={`${open ? "w-72" : "w-20"} duration-200 h-screen pt-8 p-5 bg-gray-900 text-white relative`}>
        <img src="./assets/icons/sidebar.png" className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 ${!open && "rotate-180"}`} onClick={() => setOpen(!open)} />
        <div className="flex gap-x-4 items-center">
          <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>Dashboard</h1>
        </div>
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li key={index} onClick={()=> handleMenuClick(menu)} className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700 rounded-md ${menu.gap ? "mt-9" : "mt-2"}`}>
              <img className="cursor-pointer top-9 w-6" src={`./assets/icons/${menu.src}.png`} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>{menu.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-auto p-7 text-2xl font-semibold h-screen">
        <div className="flex">
          <h1 className="py-3 px-5 mr-96 bg-gray-400 border rounded-md border-grey-50 text-gray-800">
            Active Vehicles <span>{totalItems}</span>
          </h1>
          <button type="button" onClick={handleAddVehicleClick} className="py-3 px-5 mr-96 bg-gray-400 border rounded-md border-grey-50 text-gray-800">
            Add Vehicles
          </button>
        </div>
        {showForm && (
          <div className="mt-12 rounded-md modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <form className="bg-white p-6 shadow-md rounded-md">
              <div className="mb-4">
                <label htmlFor="vehicleName" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Name</label>
                <input onChange={(e) => setVehicleName(e.target.value)} type="text" id="vehicleName" className="w-full border border-gray-300 p-2 rounded-md" placeholder="Enter Vehicle Name" />
              </div>

              <div className="mb-4">
                <label htmlFor="from" className="block text-gray-700 text-sm font-bold mb-2">Path (From)</label>
                <input onChange={(e) => setFrom(e.target.value)} type="text" id="from" className="w-full border border-gray-300 p-2 rounded-md" placeholder="From" />
              </div>

              <div className="mb-4">
                <label htmlFor="to" className="block text-gray-700 text-sm font-bold mb-2">Path (To)</label>
                <input onChange={(e) => setTo(e.target.value)} type="text" id="to" className="w-full border border-gray-300 p-2 rounded-md" placeholder="To" />
              </div>

              <button onClick={handleSubmit} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xl">Submit</button>
            </form>
          </div>
        )}

        <div className="mt-4 mb-8">
          <input type="text" placeholder="Search..." className="w-full p-2 border rounded-md" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <table className="min-w-full border bg-white shadow-md rounded-md overflow-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Route</th>
              <th className="py-2 px-4">From</th>
              <th className="py-2 px-4">To</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {searchQuery.length > 0 ? (
              filteredVehicles.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
                  <td className="py-2 px-4">{item.vehicleName}</td>
                  <td className="py-2 px-4">{item.from}</td>
                  <td className="py-2 px-4">{item.to}</td>
                  <td className="py-2 px-4">
                    <div className="flex space-x-2">
                      <button className={`${item.activation ? "bg-red-500" : "bg-green-500"} text-white p-2 rounded-full mr-2`} onClick={() => handleActivation(item._id, !item.activation)}>
                        {item.activation ? "Deactivate" : "Activate"}
                      </button>
                      <Link to={`/admin/editTransport/${item._id}`} className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition duration-300">Edit</Link>
                      <button onClick={() => handleDelete(item._id)}>
                        <img className="w-8 h-8 transition-transform duration-300 ease-in-out transform hover:scale-110" src={"./assets/icons/trash-binpng.png"} alt="Trash Bin" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              vehicles.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
                  <td className="py-2 px-4">{item.vehicleName}</td>
                  <td className="py-2 px-4">{item.from}</td>
                  <td className="py-2 px-4">{item.to}</td>
                  <td className="py-2 px-4">
                    <div className="flex space-x-2">
                      <button className={`${item.activation ? "bg-red-500" : "bg-green-500"} text-white p-2 rounded-full mr-2`} onClick={() => handleActivation(item._id, !item.activation)}>
                        {item.activation ? "Deactivate" : "Activate"}
                      </button>
                      <Link to={`/admin/editTransport/${item._id}`} className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition duration-300">Edit</Link>
                      <button onClick={() => handleDelete(item._id)}>
                        <img className="w-8 h-8 transition-transform duration-300 ease-in-out transform hover:scale-110" src={"./assets/icons/trash-binpng.png"} alt="Trash Bin" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransport;
