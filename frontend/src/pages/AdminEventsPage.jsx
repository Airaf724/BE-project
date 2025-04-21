import React, { useEffect } from "react";
import EventCard from "../components/EventCard";
import { useAuthStore } from "../store/authStore";
import { useEventStore } from "../store/eventStore";

const AdminEventsPage = () => {
  const { user } = useAuthStore();
  const { events, fetchEventsByAdmin } = useEventStore();

  useEffect(() => {
    fetchEventsByAdmin(user?._id);
  }, []);
  return (
    <div className="p-6 ml-[260px]">
      {" "}
      {/* Shift right for sidebar (adjust width as needed) */}
      <h1 className="text-2xl font-bold mb-6">Your Created Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event?._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default AdminEventsPage;
