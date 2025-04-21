import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Layers,
  FileText,
  Calendar,
  Users,
  CalendarDays,
  Image as ImageIcon,
  Clock,
  Gift,
  ArrowLeft,
  Save,
  Upload,
} from "lucide-react";
import { useEventStore } from "../../store/eventStore";
import { useAuthStore } from "../../store/authStore";

const CreateEvent = () => {
  const { error, isLoading, createEvent } = useEventStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    domain: "",
    community: "",
    location: "",
    date: "",
    time: "",
    image: null,
    imagePreview: "",
    registrationReward: "",
    attendanceReward: "",
    collegeId: user?.college,
    adminId: user?._id,
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      description,
      domain,
      community,
      location,
      date,
      time,
      image,
      collegeId,
      adminId,
    } = eventData;

    if (
      !name ||
      !description ||
      domain === "" ||
      community === "" ||
      !location ||
      !date ||
      !time ||
      !image ||
      !collegeId ||
      !adminId
    ) {
      alert("Please fill in all the fields!");
      return;
    }

    try {
      await createEvent(eventData);
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Create Event</h1>
      </div>

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
              {eventData.imagePreview ? (
                <img
                  src={eventData.imagePreview}
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
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended size: 800x600 pixels, PNG or JPG format
              </p>
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
              value={eventData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Domain</label>
            <select
              name="domain"
              value={eventData.domain}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Domain</option>
              <option value="technical">Technology</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
              <option value="others">Other</option>
            </select>
          </div>
        </div>

        {/* Community Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Community</label>
          <select
            name="community"
            value={eventData.community}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Community</option>
            <option value="TPO">TPO</option>
            <option value="GDSC">GDSC</option>
            <option value="ITSA">ITSA</option>
            <option value="others">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={eventData.description}
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
              value={eventData.location}
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
              name="date"
              value={eventData.date}
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
              type="text"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g. 2:00 PM"
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
              value={eventData.registrationReward}
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
              value={eventData.attendanceReward}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
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
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
