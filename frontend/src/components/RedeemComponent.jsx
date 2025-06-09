import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { useRewardStore } from "../store/rewardStore";
import coin from "../assets/store/coin.png";

const RedeemComponent = () => {
  const { user } = useAuthStore();
  const points = user?.points;
  const { rewards, fetchRewards } = useRewardStore();

  useEffect(() => {
    fetchRewards();
  }, []);

  // Function to truncate text
  const truncateText = (text, lines) => {
    if (!text) return "";
    const words = text.split(" ");
    return (
      words.slice(0, lines * 10).join(" ") +
      (words.length > lines * 10 ? "..." : "")
    );
  };

  return (
    <div className="flex justify-center py-6 min-h-screen">
      <div className="container max-w-7xl px-4">
        <div className="flex items-center justify-center mb-6"></div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
          {rewards?.map((reward) => (
            <div
              key={reward._id}
              className="w-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Section */}
              <div
                className="relative w-full h-44 overflow-hidden cursor-pointer"
                onClick={() => window.open(reward.courseLink, "_blank")}
              >
                <img
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-m font-bold px-2 py-1 rounded-full flex items-center">
                  {reward.points}
                  <img src={coin} alt="coin" className="h-3 w-3 ml-1" />
                </div>
              </div>

              {/* Details Section */}
              <div className="h-32 p-4 border-b">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {reward.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {truncateText(reward.description, 2)}
                </p>
              </div>

              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {reward.category}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-xs">Level: {reward.level}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-green-600 font-medium">
                      ₹{reward.price}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/placeorder?id=${reward._id}&title=${encodeURIComponent(
                    reward.name
                  )}&image=${encodeURIComponent(reward.image)}&points=${
                    reward.points
                  }&courseLink=${encodeURIComponent(reward.courseLink)}`}
                  className="block"
                >
                  <button
                    disabled={points < 3000}
                    className={`w-full py-2 px-4 rounded-lg ${
                      points < 3000
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    } transition-colors duration-300`}
                  >
                    {points < 3000 ? "Not Enough Points" : "Redeem Now"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        {rewards?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No rewards available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemComponent;
