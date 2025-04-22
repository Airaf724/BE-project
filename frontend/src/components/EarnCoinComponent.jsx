import React from "react";
import coin from "../assets/store/coin.png";

const MissionCard = ({
  points = 10,
  missionName = "Attend a Event",
  onClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full sm:w-[48%] md:w-[30%] lg:w-[22%]">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-full flex flex-col justify-center items-center gap-5">
            <img src={coin} alt="Coin" className="w-[25px] h-[25px] ml-4" />
            <span className="font-semibold ml-3 text-lg text-[#FEA116]">
              +{points}
            </span>
          </div>
          <div className="py-4 w-full flex flex-col items-center">
            <h3 className="text-base font-medium mb-2">{missionName}</h3>
            <button
              onClick={onClick}
              className="w-[70%] bg-white-500 border border-[#FEA116] border-dashed hover:bg-[#604419] text-[#FEA116] px-4 py-2 rounded-md w-32 transition-colors"
            >
              Go to Mission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EarnCoinComponent = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <h2 className="text-2xl font-bold">Check-in Missions</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[30px] mt-[50px] 
        max-[1280px]:gap-[10px] max-[1280px]:mt-[30px]
        max-[1024px]:gap-[5px] max-[1024px]:mt-[20px]
        max-[800px]:grid-cols-2 max-[800px]:gap-[5px] max-[800px]:mt-[20px]
        max-[500px]:grid-cols-2 max-[500px]:gap-[20px]"
      >
        <MissionCard
          points={10}
          missionName="Attend a Event"
          onClick={() => console.log("Mission clicked")}
        />
        {/* Add more MissionCard components as needed */}
      </div>
    </div>
  );
};

export default EarnCoinComponent;
