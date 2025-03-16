import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEventStore } from "../../store/eventStore";
import axios from "axios";
const ManageEventAttendees = () => {
  const { eventId } = useParams();
  const [users, setUsers] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // Track status of users
  const { event, fetchEventById } = useEventStore();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        await fetchEventById(eventId); // Fetch event details

        if (event?.registered?.length) {
          const response = await axios.post(
            "http://localhost:5000/api/users/getusersbyids",
            {
              userIds: event?.registered,
            }
          );

          const usersData = response?.data?.data;
          setUsers(usersData);

          // Initialize status map
          const initialStatus = {};
          usersData.forEach((user) => {
            const eventStatus = user.registeredEvents.find(
              (ev) => ev.eventId === eventId
            )?.status;
            initialStatus[user._id] = eventStatus || "Registered"; // Default to "Pending" if not found
          });

          setStatusMap(initialStatus);
        }
      } catch (e) {
        console.error("Error fetching event details", e);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // console.log("event", event?.attendanceReward);
  const reward = event?.attendanceReward || 0;

  const handleStatusChange = async (userId, eventId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [userId]: newStatus }));

    try {
      await axios.post("http://localhost:5000/api/users/updateStatus", {
        userId,
        eventId,
        newStatus,
        reward,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Manage Attendees - {event?.name}
      </h2>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 border text-left">Name</th>
            <th className="py-3 px-4 border text-left">Email</th>
            <th className="py-3 px-4 border text-center">Status</th>
            <th className="py-3 px-4 border text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t hover:bg-gray-100 transition duration-200"
            >
              <td className="py-3 px-4 border">{user.name}</td>
              <td className="py-3 px-4 border">{user.email}</td>
              <td className="py-3 px-4 border text-center">
                <select
                  value={statusMap[user._id] || "Registered"} // Default to "Pending" only if status is not found
                  onChange={(e) =>
                    handleStatusChange(user._id, eventId, e.target.value)
                  }
                >
                  <option value="Registered">Registered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-3 px-4 border text-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Give Reward
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEventAttendees;
