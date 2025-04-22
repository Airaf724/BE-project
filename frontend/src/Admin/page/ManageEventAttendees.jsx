import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEventStore } from "../../store/eventStore";
import { useUserStore } from "../../store/userStore";
import { toast } from "react-toastify"; // Import toast

const ManageEventAttendees = () => {
  const { eventId } = useParams();
  const [users, setUsers] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const { event, fetchEventById } = useEventStore();
  const { getUsersByIds, updateUserEventStatus, giveUserReward } =
    useUserStore();
  const [rewardInputVisible, setRewardInputVisible] = useState(null);
  const [rewardAmountMap, setRewardAmountMap] = useState({});

  useEffect(() => {
    const fetchEventAndUsers = async () => {
      try {
        await fetchEventById(eventId);

        if (event?.registered?.length) {
          const usersData = await getUsersByIds(event.registered);
          setUsers(usersData);

          // Initialize status map
          const initialStatus = {};
          usersData.forEach((user) => {
            const eventStatus = user.registeredEvents.find(
              (ev) => ev.eventId === eventId
            )?.status;
            initialStatus[user._id] = eventStatus || "Registered";
          });

          setStatusMap(initialStatus);
        }
      } catch (e) {
        console.error("Error fetching event details", e);
      }
    };

    if (eventId) {
      fetchEventAndUsers();
    }
  }, [eventId, event?.registered?.length]);

  const reward = event?.attendanceReward || 0;

  const handleStatusChange = async (userId, eventId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [userId]: newStatus }));

    try {
      await updateUserEventStatus(userId, eventId, newStatus, reward);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleGiveReward = async (userId, rewardAmount) => {
    try {
      await giveUserReward(userId, eventId, rewardAmount);

      // Show success toast message instead of alert
      toast.success("Reward given successfully!");

      setRewardInputVisible(null);
      setRewardAmountMap((prev) => ({
        ...prev,
        [userId]: "",
      }));
    } catch (err) {
      console.error("Error giving reward:", err);
      toast.error("Failed to give reward");
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
                  value={statusMap[user._id] || "Registered"}
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
                <div className="flex flex-col items-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() =>
                      setRewardInputVisible((prev) =>
                        prev === user._id ? null : user._id
                      )
                    }
                  >
                    Give Reward
                  </button>

                  {rewardInputVisible === user._id && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Reward"
                        value={rewardAmountMap[user._id] || ""}
                        onChange={(e) =>
                          setRewardAmountMap((prev) => ({
                            ...prev,
                            [user._id]: e.target.value,
                          }))
                        }
                        className="border px-2 py-1 w-20 rounded"
                      />
                      <button
                        onClick={() =>
                          handleGiveReward(user._id, rewardAmountMap[user._id])
                        }
                        className="text-green-600 hover:text-green-800"
                        title="Submit Reward"
                      >
                        ✅
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEventAttendees;
