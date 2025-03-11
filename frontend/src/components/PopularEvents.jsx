import React, { useEffect, useState } from "react";
import Item from "./Item";
import { useEventStore } from "../store/eventStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications

const PopularEvents = () => {
  const { events, fetchEvents, registerForEvent, isLoading } = useEventStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [registrationInProgress, setRegistrationInProgress] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  return (
    <div className="flex flex-col items-center gap-[10px] mb-[100px]">
      <div className="w-full max-w-7xl px-4">
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-[#171717] mb-4">
          Popular Events
        </h1>
        <hr className="w-48 h-1.5 bg-[#252525] rounded-lg mx-auto mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {events.map((item) => (
            <Item
              key={item._id}
              event={item}
              handleRegistration={handleRegistration}
              userId={user?._id}
              disabled={registrationInProgress || isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularEvents;
