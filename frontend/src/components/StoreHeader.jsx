import React from "react";
import logoImage from "../assets/footer_logo.jpeg";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const StoreHeader = ({ activeTab, handleTab }) => {
  const { user } = useAuthStore();
  return (
    <div className="relative h-[400px] bg-gradient-to-b from-[#3c4859] to-[#292929] flex flex-col items-center justify-center">
      {/* Points Box */}
      <div className="absolute top-0 right-[10%] bg-[#181818] rounded-lg px-4 py-2 text-white shadow-md">
        Your Points:{" "}
        <span className="text-yellow-400 font-semibold">{user?.points}</span>
      </div>

      {/* Logo Section */}
      <div className="w-24 h-24 mb-4">
        <img
          src={logoImage}
          alt="Event Store Logo"
          className="w-full h-full rounded-full border-4 border-gray-700 shadow-lg"
        />
      </div>

      {/* Store Title */}
      <h1 className="text-4xl font-extrabold">
        <span className="text-white">Event</span>
        <span className="text-gray-400 ml-2">Store</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-center text-lg mt-2">
        Shop in our store or redeem our products for free using EventCoins.
      </p>

      {/* Buttons Section */}
      <div className="flex gap-6 mt-8">
        <button
          className={`px-5 py-2 rounded-full text-lg font-medium transition-all duration-300 ${
            activeTab === "redeem"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => handleTab("redeem")}
        >
          🎁 Redeem
        </button>

        <button
          className={`px-5 py-2 rounded-full text-lg font-medium transition-all duration-300 ${
            activeTab === "earn"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => handleTab("earn")}
        >
          + Earn LeetCoin
        </button>

        {/* View Orders Link */}
        <Link
          to="/orders"
          className="text-white border border-dashed border-white rounded-full px-6 py-2 text-lg font-medium transition-all duration-300 hover:bg-white hover:text-black"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default StoreHeader;
