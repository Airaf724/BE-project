import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Calendar } from "lucide-react";
import { formatDate } from "../utils/Date";
import CoinDialog from "./CoinDialog";

const Item = ({ event, handleRegistration, userId, disabled }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isRegistered = userId && event.registered?.includes(userId);
  const formatedDate = formatDate(event.event_date);

  const date = formatedDate.split(",")[0] + "," + formatedDate.split(",")[1];
  const time = formatedDate.split(",")[2];

  const truncateText = (text, wordCount) => {
    const words = text.split(" ");
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(" ") + "...";
    }
    return text;
  };

  const registrationReward = event?.registrationReward;

  // Modified to first register and then show dialog
  const handleRegisterClick = async () => {
    try {
      await handleRegistration(event._id);
      setIsDialogOpen(true); // Show dialog after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error if needed
    }
  };

  // Dialog just needs to close now
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="w-72 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <Link to={`/event/${event._id}`}>
        <div className="relative w-full h-44 overflow-hidden">
          <img
            onClick={() => window.scrollTo(0, 0)}
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="h-[125px] p-4 border-b">
        <h3 className="font-bold text-lg text-gray-800 mb-2">
          {truncateText(event.name, 7)}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {" "}
          {truncateText(event.description, 5) ||
            "Join us for an amazing event filled with innovation and technology"}
        </p>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm line-clamp-1">
                {event.location || "Venue TBA"}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{time || "9:00 PM"}</span>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center justify-end text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{date || "TBA"}</span>
            </div>
            <div className="text-green-600 font-medium">₹Free</div>
          </div>
        </div>

        <button
          onClick={handleRegisterClick} // Changed to the new handler
          disabled={disabled || isRegistered}
          className={`w-full py-2 px-4 rounded ${
            isRegistered
              ? "bg-green-500 text-white cursor-not-allowed"
              : disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-500 text-white"
          }`}
        >
          {isRegistered ? "Done" : disabled ? "Processing..." : "Register"}
        </button>
      </div>

      <CoinDialog
        isOpen={isDialogOpen}
        registrationReward={registrationReward}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose} // Just close the dialog on confirm
      />
    </div>
  );
};

export default Item;
