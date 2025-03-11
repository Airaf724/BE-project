import React, { useEffect, useState } from "react";
import { useEventStore } from "../store/eventStore";
import { formatDate } from "../utils/Date.js";
import Pageination from "../components/Pageination.jsx";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const { events, fetchEvents } = useEventStore();
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    fetchEvents();
  }, []);

  const PAGE_SIZE = 6;
  const noOfEntries = events?.length || 0;
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
    <div className=" relative flex-2 ml-64 p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">All Events</h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border ">Event Name</th>
              <th className="py-2 px-4 border">Date of Event</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Event Entries</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(startIdx, endIdx).map((event) => (
              <tr
                key={event._id}
                className="border-t text-gray-600 hover:bg-gray-100 transition duration-200"
              >
                <td className="py-3 px-6 border text-blue-600 font-medium">
                  <Link
                    to={`/admin/events/${event._id}`}
                    className="hover:underline"
                  >
                    {event.name}
                  </Link>
                </td>
                <td className="py-3 px-6 border text-center">
                  {formatDate(event.event_date)}
                </td>
                <td className="py-3 px-6 border text-center">
                  {event.location}
                </td>
                <td className="py-3 px-6 border text-center">
                  {event.registered?.length ?? 0}
                </td>
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

export default AdminDashboard;
