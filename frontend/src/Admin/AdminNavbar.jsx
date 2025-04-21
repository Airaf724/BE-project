import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoImage from "../assets/footer_logo.jpeg";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {showSidebar ? (
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out 
          md:translate-x-0 z-50`}
        >
          <div className="flex items-center justify-between mr-5 p-4 border-b border-gray-700">
            <Link to="/admin">
              <img
                src={logoImage}
                alt="Logo"
                className="h-16 w-16 rounded-full"
              />
            </Link>
            <Menu onClick={() => handleSidebar()} size={24} />
          </div>
          <ul className="mt-4 space-y-4">
            <li>
              <Link
                to="/admin/create-event"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Create Event
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage_event_attendence"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Manage Attendence
              </Link>
            </li>
            <li>
              <Link
                to="/admin/mange"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Manage Students
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Manage Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/addrewards"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Add Rewards
              </Link>
            </li>
            <li>
              <Link
                to="/admin/managerewards"
                className="block py-2 px-4 hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Manage Rewards
              </Link>
            </li>
          </ul>
          <div className="absolute bottom-4 w-full px-4">
            {isAuthenticated && (
              <button
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      ) : (
        <X size={24} onClick={() => handleSidebar()} />
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded bg-gray-900 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default AdminNavbar;
