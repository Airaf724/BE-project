import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Building2,
  ChevronDown,
  PersonStanding,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { useCollegeStore } from "../store/collegeStore";

const ProfilePage = () => {
  const { user, isCheckingAuth } = useAuthStore();
  const { setUserprofile } = useUserStore();
  const navigate = useNavigate();
  const { colleges, getColleges, loading } = useCollegeStore();
  const [collegeId, setCollegeId] = useState(""); // New state for selected college
  const userProfile = user.profile || {};
  const [erp, setErpNumber] = useState(userProfile.erp || "");
  const [branch, setBranch] = useState(userProfile.branch || "");
  const [gender, setGender] = useState(userProfile.gender || "");
  const [mobileNumber, setMobileNumber] = useState(userProfile.phone || "");

  // Fetch colleges when component mounts
  useEffect(() => {
    getColleges().catch((error) => {
      console.error("Failed to fetch colleges:", error);
    });
  }, []);

  // Handle loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    useEffect(() => {
      navigate("/login");
    }, []);
    return null;
  }

  const userId = user._doc?._id || user._id;

  // Extract profile, handling different data structures

  // Set college ID from user data if available
  useEffect(() => {
    if (user && user.college) {
      setCollegeId(user.college);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting with user ID:", userId);

    if (!erp || !mobileNumber || !branch || !gender || !collegeId) {
      alert("Please fill in all required fields");
      return;
    }

    if (!userId) {
      console.error("User ID is missing", user);
      alert("User information is not available. Please log in again.");
      return;
    }

    const formData = {
      erp,
      branch,
      gender,
      mobileNumber: mobileNumber,
      collegeId, // Include college ID in the form data
    };

    try {
      // Pass collegeId to setUserprofile function
      await setUserprofile(userId, formData);
      navigate("/");
    } catch (error) {
      console.log("Profile update error:", error);
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
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Update Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="PRN Number"
                  value={erp}
                  onChange={(e) => setErpNumber(e.target.value)}
                  className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <PersonStanding className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Branch</option>
                  <option value="IT">IT</option>
                  <option value="CS">CS</option>
                  <option value="ENTC">ENTC</option>
                </select>
                <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* College Dropdown - Moved above mobile number */}
              <div className="relative">
                <select
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Select College</option>
                  {colleges &&
                    colleges.map((college) => (
                      <option key={college._id} value={college._id}>
                        {college.name}
                      </option>
                    ))}
                </select>
                <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                {loading && (
                  <span className="absolute right-10 top-2.5 text-sm text-gray-500">
                    Loading...
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              Save Profile
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
