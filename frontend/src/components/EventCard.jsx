import React, { useState } from "react";
import { Calendar, Clock, MapPin, Pencil, Trash2, Gift } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/Date";
import { useEventStore } from "../store/eventStore";

const EventCard = ({ event, onDelete, isAdmin = false }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const formatedDate = formatDate(event?.event_date || event?.date);
  const date = formatedDate?.split(",")[0] + "," + formatedDate.split(",")[1];
  const time = event.event_time || formatedDate.split(",")[2];
  const { deleteEvent } = useEventStore();

  const truncateText = (text, wordCount) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(" ") + "...";
    }
    return text;
  };

  // Handle edit button click - navigate to edit page
  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-event/${event._id}`);
  };

  // Handle delete button click
  const handleDeleteClick = async (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!eventId) {
      console.error("No event ID provided for deletion");
      return;
    }

    try {
      setIsDeleting(true);
      console.log("Deleting event with id", eventId);

      // Call the deleteEvent function from the store and wait for it to complete
      const result = await deleteEvent(eventId);

      // If deletion was successful and onDelete prop exists, call it
      if (result && onDelete) {
        onDelete(eventId);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full sm:w-72 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
      <Link to={`/event/${event._id}`}>
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full transition-transform duration-300 hover:scale-105"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>
      </Link>

      <div className="p-4 border-b">
        <h3 className="font-bold text-lg text-gray-800 mb-1">
          {truncateText(event.name, 6)}
        </h3>
        <p className="text-sm text-gray-500 mb-1">Domain: {event.domain}</p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {truncateText(event.description, 7)}
        </p>
      </div>

      <div className="p-4 text-sm text-gray-700">
        <div className="flex justify-between mb-2">
          <div>
            <div className="flex items-center mb-1">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location || "Venue TBA"}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {time || "TBA"}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              {date}
            </div>
            <div className="text-green-600 font-medium">
              {event.isOpen ? "Open" : "Closed"}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-orange-500">
            <Gift size={16} className="mr-1" />
            Reg. Reward: {event.registrationReward || 0}
          </div>
          <div className="flex items-center text-blue-500">
            <Gift size={16} className="mr-1" />
            Attend: {event.attendanceReward || 0}
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex space-x-2">
        <button
          onClick={handleEditClick}
          className="p-1 bg-white rounded-full text-blue-600 hover:text-blue-800 shadow-md"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={(e) => handleDeleteClick(e, event?._id)}
          disabled={isDeleting}
          className={`p-1 bg-white rounded-full ${
            isDeleting ? "text-gray-400" : "text-red-600 hover:text-red-800"
          } shadow-md`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
