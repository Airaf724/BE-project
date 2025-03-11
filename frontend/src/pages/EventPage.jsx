import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEventStore } from "../store/eventStore";
import Item from "../components/Item";
import { useAuthStore } from "../store/authStore";

const EventPage = () => {
  const { pathname } = useLocation();
  const domain = pathname.split("/")[2];
  const { domainEvents, fetchDomainEvents, registerForEvent } = useEventStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        await fetchDomainEvents(domain);
      } catch (error) {
        console.error("Failed to fetch domain events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [domain, fetchDomainEvents]);
  const handleRegistration = async (eventId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await registerForEvent(eventId, user?._id);
      // Refresh the events list after registration
      await fetchDomainEvents(domain);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  console.log(domainEvents);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!domainEvents || domainEvents.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-16 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#171717] mb-6">
          {domain} Events
        </h1>
        <hr className="w-48 h-1.5 bg-[#252525] rounded-lg mx-auto mb-12" />
        <p className="text-xl text-gray-600">
          No events found for this domain.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-8 lg:px-16 py-6">
      <div className="container mx-auto">
        <h1 className="text-center text-64px md:text-2xl font-semibold text-[#1A1A1A] mb-6">
          {domain.charAt(0).toUpperCase() + domain.slice(1)} Events
        </h1>
        <hr className="w-48 h-1.5 bg-[#252525] rounded-lg mx-auto mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 justify-center">
          {domainEvents?.map((item, i) => (
            <Item
              key={item._id} // Changed from index to unique ID
              event={item}
              handleRegistration={handleRegistration}
              userId={user?._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
