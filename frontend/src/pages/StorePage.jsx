import React, { useState } from "react";
import StoreHeader from "../components/StoreHeader";
import RedeemComponent from "../components/RedeemComponent";
import EarnCoinComponent from "../components/EarnCoinComponent";
const StorePage = () => {
  const [activeTab, setActiveTab] = useState("redeem");
  const handleTab = (event) => {
    setActiveTab(event);
  };
  return (
    <div>
      <StoreHeader activeTab={activeTab} handleTab={handleTab} />
      <div className="w-full flex justify-center mt-8">
        {activeTab === "redeem" ? <RedeemComponent /> : <EarnCoinComponent />}
      </div>{" "}
    </div>
  );
};

export default StorePage;
