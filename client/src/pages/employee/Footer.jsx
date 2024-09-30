import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Contact Us Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="mt-2">Email: info@geoattend.com</p>
            <p>Phone: +91 1800 500 123 247</p>
            <p>Address: 123 Main Street, City, India</p>
          </div>

          {/* Social Media Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-2 gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-white hover:text-blue-500 transition-colors duration-300" size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-white hover:text-blue-400 transition-colors duration-300" size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-white hover:text-pink-500 transition-colors duration-300" size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-white hover:text-blue-700 transition-colors duration-300" size={24} />
              </a>
            </div>
          </div>

          {/* Copyright Section */}
          <div>
            <p className="text-sm">&copy; 2024 GeoAttend All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
