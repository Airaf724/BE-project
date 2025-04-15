import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Upload,
  Save,
  ArrowLeft,
  Gift,
} from "lucide-react";
import { useEventStore } from "../../store/eventStore";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Get data and functions from event store
  const {
    event,
    isLoading,
    error,
    updateSuccess,
    fetchEventById,
    updateEvent,
    resetEventStatus,
  } = useEventStore();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    location: "",
    event_date: "",
    event_time: "",
    isOpen: true,
    image_url: "",
    registrationReward: 0,
    attendanceReward: 0,
  });

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch event data when component mounts
  useEffect(() => {
    // Fetch the event data by ID
    fetchEventById(eventId);

    // Reset update status when component unmounts
    return () => {
      resetEventStatus();
    };
  }, [eventId]);

  // Populate form when event data is loaded
  useEffect(() => {
    if (event && Object.keys(event).length > 0) {
      console.log("Loading event data:", event);

      // Format the date properly
      let formattedDate = "";
      if (event.event_date) {
        try {
          formattedDate = new Date(event.event_date)
            .toISOString()
            .split("T")[0];
        } catch (e) {
          console.error("Date parsing error:", e);
          formattedDate = "";
        }
      }

      // Set form data with event values or defaults
      setFormData({
        name: event.name || "",
        description: event.description || "",
        domain: event.domain || "",
        location: event.location || "",
        event_date: formattedDate,
        event_time: event?.event_time || "",
        isOpen: event?.isOpen !== undefined ? event.isOpen : true,
        image_url: event.image_url || "",
        registrationReward: event.registrationReward || 0,
        attendanceReward: event.attendanceReward || 0,
      });

      // Set image preview if an image URL exists
      if (event.image_url) {
        setImagePreview(event.image_url);
      }
    }
  }, [event]);

  // Handle navigation after successful update
  useEffect(() => {
    if (updateSuccess) {
      navigate(`/event/${eventId}`);
    }
  }, [updateSuccess, navigate, eventId]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Image file change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    // Create FormData object for multipart form data (image upload)
    const eventFormData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key !== "image_url" || !imageFile) {
        eventFormData.append(key, formData[key]);
      }
    });

    // Append image file if a new one was selected
    if (imageFile) {
      eventFormData.append("eventImage", imageFile);
    }

    // Update event using the store function
    updateEvent(eventId, eventFormData);
  };

  // Show loading spinner while fetching data
  if (isLoading && !event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      {/* Display event ID for debugging */}
      <p className="text-sm text-gray-500 mb-4">Editing event ID: {eventId}</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Event Image</label>
          <div className="flex items-start space-x-6">
            <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue-50">
                <Upload className="text-blue-500" />
                <span className="mt-2 text-base">Select event image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended size: 800x600 pixels, PNG or JPG format
              </p>
              {formData.image_url && !imageFile && (
                <p className="text-xs text-blue-600 mt-2">
                  Current image: {formData.image_url.split("/").pop()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Domain</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Domain</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Location and Date/Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <MapPin size={16} className="mr-1" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-1" />
              Date
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Clock size={16} className="mr-1" />
              Time
            </label>
            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Gift size={16} className="mr-1" />
              Registration Reward
            </label>
            <input
              type="number"
              name="registrationReward"
              value={formData.registrationReward}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Gift size={16} className="mr-1" />
              Attendance Reward
            </label>
            <input
              type="number"
              name="attendanceReward"
              value={formData.attendanceReward}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isOpen"
              checked={formData.isOpen}
              onChange={handleChange}
              className="rounded text-blue-500 focus:ring-blue-500 h-5 w-5 mr-2"
            />
            <span className="text-gray-700">
              Event is open for registration
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg mr-4 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
