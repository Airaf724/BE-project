import React from "react";
import { Link } from "react-router-dom";

const EventItem = ({ id, image, name, old_price, new_price }) => {
  return (
    <div className="w-[320px] max-w-[280px] sm:max-w-[160px] hover:scale-105 transition-transform duration-300">
      <Link to={`/events/${id}`}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={image}
          alt="Event"
          className="w-full h-[200px] rounded-[30px] border border-black ml-[10px] 
                     sm:w-[260px] sm:h-[180px] 
                     xs:w-[140px] xs:h-[100px]"
        />
      </Link>
      <p
        className="font-bold text-[20px] ml-[50px] my-[3px] 
                   sm:ml-[30px] 
                   xs:ml-[10px] xs:text-[12px]"
      >
        {name}
      </p>
      <div className="flex gap-[10px]">
        <div
          className="text-[#374151] text-[18px] line-through 
                     sm:text-[16px] 
                     xs:text-[12px]"
        >
          <p>₹{old_price}</p>
        </div>
        <div
          className="text-[#374151] text-[18px] 
                     sm:text-[16px] 
                     xs:text-[12px] xs:ml-0"
        >
          <p>Book for ₹{new_price} Only</p>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
