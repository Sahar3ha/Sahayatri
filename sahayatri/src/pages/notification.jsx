import React, { useEffect, useState } from 'react';
import { deleteNotification, getNotification } from '../apis/Api';
import Example from '../components/Navbar';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotification();
      setNotifications(response.data.notification);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    }
  };

  const handleClearAll = async () => {
    try {
      // Clear notifications from the database
      await deleteNotification();
      // Clear notifications from state
      setNotifications([]);
      console.log('All notifications cleared successfully.');
    } catch (error) {
      console.error('Error clearing notifications:', error.message);
    }
  };

  return (
    <>
    <Example/>
    <div className="bg-gray-100 min-h-screen flex flex-col sm:flex-row justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 mt-4 sm:mt-0 sm:ml-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Notifications</h2>
        {notifications.map((notification, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded-md mb-4">
            <div className="text-lg font-semibold text-gray-800">{notification.vehicleId.vehicleName}</div>
            <div className="text-sm text-gray-600">is offline</div>
          </div>
        ))}
        {notifications.length > 0 && (
          <button onClick={handleClearAll} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none">
            Clear All
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default NotificationPage;
