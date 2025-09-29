import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-12 w-auto"
                src="/nutriveda-logo.png"
                alt="NutriVeda"
              />
              <span className="ml-2 text-2xl font-semibold text-gray-900">NutriVeda</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/patients"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Patients
              </Link>
              <Link
                to="/diet-plans"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Diet Plans
              </Link>
              <Link
                to="/recipes"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
