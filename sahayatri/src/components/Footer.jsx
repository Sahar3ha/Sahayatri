import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
            <li>
              <a href="#" className="text-sm hover:text-gray-300">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-gray-300">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-gray-300">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
