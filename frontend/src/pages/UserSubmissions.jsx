import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useEventStore } from "../store/eventStore";
import Pageination from "../components/Pageination";

const UserSubmissions = () => {
  const { user } = useAuthStore();
  const { events, fetchEvents } = useEventStore();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasFetched, setHasFetched] = useState(false); // State to track fetching status

  useEffect(() => {
    if (!hasFetched && events.length === 0) {
      fetchEvents();
      setHasFetched(true); // Set to true after calling fetchEvents once
    }
  }, [hasFetched, events]);

  useEffect(() => {
    if (user && events.length > 0) {
      // Find events user is registered for
      const userRegisteredEvents = events
        .filter((event) =>
          user.registeredEvents.some(
            (regEvent) => regEvent.eventId === event._id
          )
        )
        .map((event) => {
          // Find the corresponding registration status from user's registeredEvents
          const registrationInfo = user.registeredEvents.find(
            (regEvent) => regEvent.eventId === event._id
          );

          return {
            ...event,
            status: registrationInfo ? registrationInfo.status : "Unknown",
          };
        });

      setRegisteredEvents(userRegisteredEvents);
    }
  }, [user, events]);

  if (!user) return <div>Please log in to view registered events</div>;

  const PAGE_SIZE = 6;
  const noOfEntries = registeredEvents?.length || 0;
  const noOfPages = Math.ceil(noOfEntries / PAGE_SIZE);

  const startIdx = currentPage * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleNextPageChange = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handlePrevPageChange = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Registered Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Event Name</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Date of Event</th>
              <th className="py-2 px-4 border">Location</th>
            </tr>
          </thead>
          <tbody>
            {registeredEvents.slice(startIdx, endIdx).map((event) => (
              <tr key={event._id} className="text-center border-t">
                <td className="py-2 px-4 border text-blue-600">{event.name}</td>
                <td
                  className={`py-2 px-4 border ${
                    event.status === "Registered"
                      ? "text-green-600"
                      : event.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {event.status}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(event.event_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pageination
        noOfPages={noOfPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        handleNextPageChange={handleNextPageChange}
        handlePrevPageChange={handlePrevPageChange}
      />
    </div>
  );
};

export default UserSubmissions;
