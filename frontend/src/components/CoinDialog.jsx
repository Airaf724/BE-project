import React from "react";
import { motion } from "framer-motion";
import coin from "../assets/store/coin.png";

const CoinDialog = ({ isOpen, registrationReward, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg relative flex flex-col items-center">
        <h2 className="text-xl font-bold text-green-600 mb-4">
          {` Congratulations🎉! You have earned ${registrationReward} points`}
        </h2>
        <motion.img
          src={coin}
          alt="Rotating Coin"
          className="w-[150px] h-[150px]" // Adjusted size for better alignment
          animate={{ rotateY: [0, 360] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CoinDialog;
