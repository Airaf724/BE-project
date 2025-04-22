import React, { useEffect, useState } from "react";
import Item from "./Item";
import { useEventStore } from "../store/eventStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCollegeStore } from "../store/collegeStore";

const PopularEvents = () => {
  const { events, fetchEvents, registerForEvent, isLoading } = useEventStore();
  const { getColleges, colleges } = useCollegeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

  useEffect(() => {
    getColleges();
  }, [getColleges]);

  useEffect(() => {
    // Pass both collegeId and activeTab parameters to match the controller requirements
    fetchEvents(selectedCollege, "college");
  }, [fetchEvents, selectedCollege]);

  const handleRegistration = async (eventId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (registrationInProgress) {
      return; // Prevent double submission
    }

    try {
      setRegistrationInProgress(true);
      const response = await registerForEvent(eventId, user._id);

      if (response.status === "Registered") {
        toast.success("Successfully registered for event!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to register for event"
      );
    } finally {
      setRegistrationInProgress(false);
    }
  };

  const handleCollegeSelect = (collegeId) => {
    setSelectedCollege(collegeId);
    setShowCollegeDropdown(false);
  };

  // Find college name from selected ID
  const getCollegeName = () => {
    if (selectedCollege === "all") return "All Colleges";
    const college = colleges.find((c) => c._id === selectedCollege);
    return college ? college.name : "My College";
  };

  return (
    <div
      id="popular-events"
      className="flex flex-col items-center gap-[10px] mb-[100px]"
    >
      <div className="w-full max-w-7xl px-4">
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#171717] mb-4">
          Popular Events
        </h1>
        <hr className="w-48 h-1.5 bg-[#252525] rounded-lg mx-auto mb-12" />

        <div className="flex justify-center mb-8">
          {/* College Dropdown Button - Increased Width and Font Size */}
          <div className="relative w-72 md:w-96">
            <button
              type="button"
              className="w-full px-5 py-3 text-base font-medium border flex items-center justify-between bg-white text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm"
              onClick={() => setShowCollegeDropdown(!showCollegeDropdown)}
            >
              <span>{getCollegeName()}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {/* College Dropdown Menu - Increased Font Size */}
            {showCollegeDropdown && (
              <div className="absolute left-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {colleges &&
                    colleges.map((college) => (
                      <button
                        key={college._id}
                        className="w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-100"
                        onClick={() => handleCollegeSelect(college?._id)}
                      >
                        {college.name}
                      </button>
                    ))}
                  <hr className="my-1 border-gray-200" />
                  <button
                    className="w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-100 font-medium"
                    onClick={() => handleCollegeSelect("all")}
                  >
                    All Colleges
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {events.length > 0 ? (
            events.map((item) => (
              <Item
                key={item._id}
                event={item}
                handleRegistration={handleRegistration}
                userId={user?._id}
                disabled={registrationInProgress || isLoading}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No events found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularEvents;
