import React, { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRewardStore } from "../../store/rewardStore";
import { useNavigate } from "react-router-dom";

const ManageRewards = () => {
  const { fetchRewards, rewards } = useRewardStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      // await deleteReward(id);
      console.log("Deleting reward with id:", id);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-reward/${id}`);
  };

  return (
    <div className="flex-2 ml-64 p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards?.map((reward) => (
          <div
            key={reward._id}
            className="relative bg-white shadow-lg rounded-2xl p-4 border"
          >
            {/* Top-right Edit/Delete Buttons */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(reward._id)}
                className="p-2 rounded-full border bg-white hover:bg-gray-100 transition"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(reward._id)}
                className="p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-100 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <img
              src={reward.image}
              alt={reward.name}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold">{reward.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
            <p className="text-sm">
              <strong>Price:</strong> ₹{reward.price}
            </p>
            <p className="text-sm">
              <strong>Points:</strong> {reward.points}
            </p>
            <p className="text-sm">
              <strong>Category:</strong> {reward.category}
            </p>
            <p className="text-sm">
              <strong>Level:</strong> {reward.level}
            </p>
            <a
              href={reward.courseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              View Course
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRewards;
