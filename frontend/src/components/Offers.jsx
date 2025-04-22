import React from "react";
import exclusive_img from "../assets/exclusive.png";

const Offers = () => {
  return (
    <div className="w-[95%] h-[65vh] flex mx-auto px-[140px] mb-[140px] bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22]">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-[55px] font-semibold text-[#171717]">
          Exclusive Events
        </h1>
        <h1 className="text-[55px] font-semibold text-[#171717]">
          Just for you!
        </h1>
        <p className="text-[30px] font-semibold text-[#171717] mt-[30px]">
          Save Your Seat Now!!
        </p>
        <button
          className="w-[262px] h-[50px] rounded-[35px] bg-[#ff4141] text-white text-[22px] font-medium mt-[30px] cursor-pointer"
          onClick={() => {
            const element = document.getElementById("popular-events");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Book Now!!
        </button>
      </div>
      <div className="flex-1 flex justify-end pt-[50px] items-center">
        <img
          src={exclusive_img}
          alt="Exclusive Event"
          className="w-[80vh] h-[50vh] -mr-[50px] -mt-[70px]"
        />
      </div>
    </div>
  );
};

export default Offers;
