import { Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  List,
  BookmarkIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logoImage from "../assets/footer_logo.jpeg";
import { useAuthStore } from "../store/authStore";
import NotificationsDropdown from "./NotificationsDropdown ";
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const storeRef = useRef(null);
  const [Showstore, setShowstore] = useState(false);
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (storeRef.current && !storeRef.current.contains(event.target)) {
        setShowstore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStoreToggle = () => {
    setShowstore((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-evenly items-center p-4 border-b-[1px] border-gray-200 dark:border-gray-700 bg-white">
      <div className="w-full md:w-auto flex justify-start items-center gap-5">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={logoImage} alt="Logo" className="h-10 w-10" />
          </Link>
          <Link to="/" className="text-[16px] font-bold text-gray-800">
            Event.io
          </Link>
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0 md:space-x-6 text-gray-600 font-medium mt-4 md:mt-0`}
        >
          <li>
            <Link to="/events/sports" className="hover:text-red-500">
              Sports
            </Link>
          </li>
          <li>
            <Link to="/events/cultural" className="hover:text-red-500">
              Cultural
            </Link>
          </li>
          <li>
            <Link to="/events/technical" className="hover:text-red-500">
              Technical
            </Link>
          </li>
          <li>
            <Link to="/events/competitions" className="hover:text-red-500">
              Competitions
            </Link>
          </li>
          <li ref={storeRef}>
            <button
              onClick={() => handleStoreToggle()}
              className="flex items-center cursor-pointer text-16px text-[#FFA116]"
            >
              Store
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="h-[25px] w-[25px] ml-0.5"
                fill="currentColor"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            <div
              className={`${
                Showstore
                  ? "flex flex-col px-7 py-5 absolute top-[60px] z-50 rounded-[10px] p-2 overflow-auto focus:outline-none text-lg text-[#FFA116] shadow-lg gap-2 bg-white dark:bg-gray-800 transform opacity-100 scale-100"
                  : "hidden"
              }`}
            >
              <Link to="/store">Redeem</Link>
            </div>
          </li>
        </ul>
      </div>
      {/* {user profile and notifications bell and points table } */}

      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:flex w-full md:w-auto justify-end items-center space-x-4 mt-4  md:mt-0`}
      >
        {/* profile container */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-5">
            <NotificationsDropdown />
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-10 w-10 rounded-full mr-10 bg-gray-200 flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={User}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-600" />
                  )}
                </div>
              </button>

              {isProfileOpen && (
                <div
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border"
                >
                  <div className="flex justify-center">
                    <div className="h-10 w-10 rounded-full mt-2  bg-gray-200 flex items-center justify-center">
                      {user?.profileImage ? (
                        <img
                          src={User}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-gray-800">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || "email"}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`${user?._id}/my-lists`}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <List size={20} />
                    <span>My Lists</span>
                  </Link>

                  <Link
                    to={`${user?._id}/submissions`}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <BookmarkIcon size={20} />
                    <span>Submissions</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-100"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
