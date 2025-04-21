import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Check,
  Clock,
  Award,
} from "lucide-react";
import { useEventStore } from "../store/eventStore";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/Date.js";
import { useAuthStore } from "../store/authStore";
import { useAttendanceStore } from "../store/eventAttendanceStore.js";
import toast from "react-hot-toast";
import CoinDialog from "../components/CoinDialog.jsx"; // Import the CoinDialog component

const EventDetailPage = () => {
  const { fetchEventById, event, registerForEvent, setEvent, isLoading } =
    useEventStore();
  const { user } = useAuthStore();
  const {
    generateAttendanceCode,
    verifyAttendanceCode,
    checkAttendanceStatus,
    getAttendanceStatus,
    attendanceCode,
    codeExpiry,
    isGenerating,
    isVerifying,
    isCheckingStatus,
  } = useAttendanceStore();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const eventId = pathname.split("/")[2];
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [attendanceCodeInput, setAttendanceCodeInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for CoinDialog

  const userId = user?._id;
  const isAdmin = user?.role === "admin";

  // Get attendance status either from event or from store
  const attendanceStatus = getAttendanceStatus(eventId);
  const isRegistered =
    attendanceStatus?.registered ||
    (userId && event?.registered?.includes(userId));
  const hasAttended =
    attendanceStatus?.attended ||
    (userId &&
      event?.attendees?.some(
        (att) => att.user.toString() === userId.toString()
      ));

  useEffect(() => {
    fetchEventById(eventId);

    // If user is logged in, check attendance status
    if (userId) {
      checkAttendanceStatus(eventId, userId).catch((err) => {
        console.error("Failed to fetch attendance status:", err);
        // Non-critical error - don't show to user
      });
    }
  }, [eventId, userId, fetchEventById, checkAttendanceStatus]);

  const handleRegistration = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (registrationInProgress) return;

    try {
      setRegistrationInProgress(true);
      const response = await registerForEvent(eventId, userId);

      if (response.status === "Registered") {
        toast.success("Successfully registered for event!");
        setEvent({
          ...event,
          registered: [...event.registered, userId],
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to register for event"
      );
    } finally {
      setRegistrationInProgress(false);
    }
  };

  // Generate attendance code
  const handleGenerateAttendanceCode = async () => {
    try {
      await generateAttendanceCode(eventId);
      toast.success("Attendance code generated successfully");
    } catch (err) {
      toast.error("Failed to generate attendance code");
    }
  };

  // Verify attendance code
  const handleVerifyAttendanceCode = async () => {
    if (!attendanceCodeInput) {
      toast.error("Please enter the attendance code");
      return;
    }

    if (!isRegistered) {
      toast.error("You must register for the event first");
      return;
    }

    if (hasAttended) {
      toast.error("Your attendance has already been marked");
      return;
    }

    try {
      // Submit the attendance code
      const response = await verifyAttendanceCode(
        eventId,
        attendanceCodeInput,
        userId
      );

      // Show success message
      toast.success("Attendance marked successfully!");

      // Clear input field
      setAttendanceCodeInput("");

      // Open the coin dialog to show points awarded (use event's attendanceReward)
      if (event?.attendanceReward > 0) {
        setIsDialogOpen(true);
      }

      // No need to refetch the entire event anymore since we're using the status from store
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  // Close the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const disabled = registrationInProgress || isLoading;

  // Function to render attendance status badge
  const renderAttendanceStatus = () => {
    if (!attendanceStatus) return null;

    const { status } = attendanceStatus;

    if (status === "Completed") {
      return (
        <div className="flex items-center justify-center bg-green-100 p-4 rounded-lg border border-green-200">
          <Check className="h-6 w-6 text-green-500 mr-2" />
          <span className="text-green-700 font-medium">
            You've attended this event
          </span>
        </div>
      );
    } else if (status === "Registered") {
      return (
        <div className="flex items-center justify-center bg-blue-100 p-4 rounded-lg border border-blue-200">
          <Clock className="h-6 w-6 text-blue-500 mr-2" />
          <span className="text-blue-700 font-medium">
            You're registered for this event
          </span>
        </div>
      );
    }

    return null;
  };

  // Display loading state
  if (isLoading && !event) {
    return (
      <div className="container flex justify-center items-center min-h-screen mx-auto">
        <p className="text-xl">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="container flex justify-center items-start min-h-screen mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full">
          <img
            src={
              event?.image_url ||
              "https://via.placeholder.com/600x400?text=Event+Image"
            }
            alt={event?.name || "Event"}
            className="rounded-lg shadow-lg w-full h-96 object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">
            {event?.name || "Loading event..."}
          </h1>

          <div className="rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">About Event</h2>
                <p className="text-gray-600">
                  {event?.description || "Loading description..."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">
                    {event ? formatDate(event.event_date) : "Loading date..."}
                  </p>
                  <p className="text-gray-600">{event?.event_time || "TBD"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <p className="text-gray-600">{event?.location || "TBD"}</p>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <p className="text-gray-600">{event?.community || "TBD"}</p>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-500" />
                <p className="text-gray-600">{event?.domain || "TBD"}</p>
              </div>

              {event?.attendanceReward > 0 && (
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  <p className="text-gray-600">
                    {event.attendanceReward} points for attendance
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Show attendance status badge */}
          {!isAdmin && renderAttendanceStatus()}

          {/* Registration Button (only for non-admins and those who haven't registered) */}
          {!isAdmin && !isRegistered && (
            <div className="flex justify-center w-full">
              <button
                onClick={handleRegistration}
                disabled={disabled}
                className={`w-full py-2 px-4 rounded ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {disabled ? "Processing..." : "Register"}
              </button>
            </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold">Admin Controls</h2>

              {/* Attendance Code Generation */}
              <div className="space-y-3 pt-2">
                <h3 className="font-medium">Code-Based Attendance</h3>
                <button
                  onClick={handleGenerateAttendanceCode}
                  disabled={isGenerating}
                  className={`w-full py-2 px-4 rounded ${
                    isGenerating
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isGenerating ? "Generating..." : "Generate Attendance Code"}
                </button>

                {attendanceCode && (
                  <div className="bg-gray-100 rounded p-4 text-center">
                    <h4 className="font-bold text-lg mb-2">Attendance Code</h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-300">
                      <p className="text-3xl font-mono tracking-wider">
                        {attendanceCode}
                      </p>
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                      Expires at: {new Date(codeExpiry).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attendance Marking for Students - only if registered and not yet attended */}
          {!isAdmin && isRegistered && !hasAttended && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h2 className="text-lg font-semibold">Mark Attendance</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={attendanceCodeInput}
                  onChange={(e) => setAttendanceCodeInput(e.target.value)}
                  placeholder="Enter attendance code"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleVerifyAttendanceCode}
                  disabled={isVerifying || !attendanceCodeInput}
                  className={`w-full py-2 px-4 rounded ${
                    isVerifying || !attendanceCodeInput
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isVerifying ? "Verifying..." : "Mark Attendance"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CoinDialog for attendance rewards */}
      <CoinDialog
        isOpen={isDialogOpen}
        registrationReward={event?.attendanceReward || 0} // Using event's attendanceReward field
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
      />
    </div>
  );
};

export default EventDetailPage;
