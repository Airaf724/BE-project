import React, { useState, useEffect } from "react";
import { Building2, MapPin, Globe, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCollegeStore } from "../../store/collegeStore";
import { toast } from "react-toastify";

const CollegeDetailsPage = () => {
  const { user, isCheckingAuth } = useAuthStore();
  const { createCollege, loading, error, success, resetState } =
    useCollegeStore();
  const navigate = useNavigate();

  // Initialize form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  // Reset store state on component unmount
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  // Handle success or error messages
  useEffect(() => {
    if (success) {
      toast.success("College details saved successfully!");
      navigate("/admin");
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate]);

  // Handle loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your details...</p>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    useEffect(() => {
      navigate("/login");
    }, [navigate]);
    return null;
  }

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !city || !state || !country) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Include the admin's ID in the college data
      const adminId = user._id || user._doc?._id;
      console.log("adminId: " + adminId);
      const collegeData = { name, city, state, country, adminId };
      await createCollege(collegeData);
    } catch (error) {
      // Error is already handled by the store
      console.log("Error in component:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
            College Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="College Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                {/* Add more countries as needed */}
              </select>
              <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save College Details"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CollegeDetailsPage;
