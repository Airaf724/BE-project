import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../../components/Input";
import {
  MapPin,
  Layers,
  FileTextIcon,
  Calendar,
  Users,
  CalendarDays,
  ImageIcon,
  Clock,
  Gift,
} from "lucide-react";
import { useEventStore } from "../../store/eventStore";
import { useAuthStore } from "../../store/authStore";

const CreateEvent = () => {
  const { error, isLoading, createEvent } = useEventStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  console.log("adminid", user?.college);
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    domain: "--select--",
    location: "",
    community: "--select--",
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
      domain === "--select--" ||
      community === "--select--" ||
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
    <div className="flex  min-h-screen">
      <div className="flex-1  md:ml-64 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">
            Create Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={Calendar}
              type="text"
              placeholder="Event Name"
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
            />
            <Input
              icon={FileTextIcon}
              type="text"
              placeholder="Description"
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
            />
            <Input
              icon={Layers}
              type="select"
              options={[
                "--select--",
                "sports",
                "technical",
                "cultural",
                "others",
              ]}
              value={eventData.domain}
              onChange={(e) =>
                setEventData({ ...eventData, domain: e.target.value })
              }
            />
            <Input
              icon={Users}
              type="select"
              options={["--select--", "TPO", "GDSC", "ITSA", "others"]}
              value={eventData.community}
              onChange={(e) =>
                setEventData({ ...eventData, community: e.target.value })
              }
            />
            <Input
              icon={MapPin}
              type="text"
              placeholder="Location"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
            />
            <Input
              icon={CalendarDays}
              type="date"
              placeholder="Date"
              value={eventData.date}
              onChange={(e) =>
                setEventData({ ...eventData, date: e.target.value })
              }
            />
            <Input
              icon={Clock}
              type="text"
              placeholder="Time"
              value={eventData.time}
              onChange={(e) =>
                setEventData({ ...eventData, time: e.target.value })
              }
            />
            <Input
              icon={ImageIcon}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {eventData.imagePreview && (
              <img
                src={eventData.imagePreview}
                alt="Preview"
                className="w-52 h-32 object-cover rounded-md"
              />
            )}
            <div className="flex gap-4 items-center">
              <Input
                icon={Gift}
                type="number"
                placeholder="Registration Reward"
                value={eventData.registrationReward}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    registrationReward: e.target.value,
                  })
                }
              />
              <Input
                icon={Gift}
                type="number"
                placeholder="Attendance Reward"
                value={eventData.attendanceReward}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    attendanceReward: e.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
