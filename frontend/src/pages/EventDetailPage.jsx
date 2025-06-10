import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Check,
  Clock,
  Award,
  AlertCircle,
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

  // Check if event date has passed
  const isEventDatePassed = () => {
    if (!event?.event_date) return false;
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return eventDate < today;
  };

  // Check if event is today
  const isEventToday = () => {
    if (!event?.event_date) return false;
    const eventDate = new Date(event.event_date);
    const today = new Date();
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  };

  const eventDatePassed = isEventDatePassed();
  const eventToday = isEventToday();

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

    if (eventDatePassed) {
      toast.error("Cannot register for past events");
      return;
    }

    if (registrationInProgress) return;

    try {
      setRegistrationInProgress(true);
      const response = await registerForEvent(eventId, userId);

      if (response.status === "registered") {
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
    if (!eventToday && !eventDatePassed) {
      toast.error("Attendance code can only be generated on the event day");
      return;
    }

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

    if (!eventToday && !eventDatePassed) {
      toast.error("Attendance can only be marked on the event day");
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

  // Function to render event date status
  const renderEventDateStatus = () => {
    if (eventDatePassed && !isRegistered && !hasAttended) {
      return (
        <div className="flex items-center justify-center bg-red-100 p-4 rounded-lg border border-red-200">
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          <span className="text-red-700 font-medium">
            Event date has passed - Registration and attendance marking are
            closed
          </span>
        </div>
      );
    }

    if (eventDatePassed && isRegistered && !hasAttended) {
      return (
        <div className="flex items-center justify-center bg-yellow-100 p-4 rounded-lg border border-yellow-200">
          <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
          <span className="text-yellow-700 font-medium">
            Event date has passed - You were registered but didn't attend
          </span>
        </div>
      );
    }

    return null;
  };

  // Function to get registration button text and state
  const getRegistrationButtonState = () => {
    if (eventDatePassed) {
      return {
        text: "Event Date Passed",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed text-white",
      };
    }

    if (disabled) {
      return {
        text: "Processing...",
        disabled: true,
        className: "bg-gray-300 cursor-not-allowed",
      };
    }

    return {
      text: "Register",
      disabled: false,
      className: "bg-orange-500 hover:bg-orange-600 text-white",
    };
  };

  // Function to get attendance marking button state
  const getAttendanceButtonState = () => {
    if (!eventToday && !eventDatePassed) {
      return {
        text: "Available on Event Day",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed text-white",
      };
    }

    if (eventDatePassed && !hasAttended) {
      return {
        text: "Event Date Passed",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed text-white",
      };
    }

    if (isVerifying || !attendanceCodeInput) {
      return {
        text: isVerifying ? "Verifying..." : "Mark Attendance",
        disabled: true,
        className: "bg-gray-300 cursor-not-allowed",
      };
    }

    return {
      text: "Mark Attendance",
      disabled: false,
      className: "bg-green-600 hover:bg-green-700 text-white",
    };
  };

  // Display loading state
  if (isLoading && !event) {
    return (
      <div className="container flex justify-center items-center min-h-screen mx-auto">
        <p className="text-xl">Loading event details...</p>
      </div>
    );
  }

  const registrationButtonState = getRegistrationButtonState();
  const attendanceButtonState = getAttendanceButtonState();

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
                    {eventToday && (
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Today
                      </span>
                    )}
                    {eventDatePassed && !eventToday && (
                      <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        Past Event
                      </span>
                    )}
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

          {/* Show event date status */}
          {!isAdmin && renderEventDateStatus()}

          {/* Show attendance status badge */}
          {!isAdmin && renderAttendanceStatus()}

          {/* Registration Button (only for non-admins and those who haven't registered) */}
          {!isAdmin && !isRegistered && (
            <div className="flex justify-center w-full">
              <button
                onClick={handleRegistration}
                disabled={registrationButtonState.disabled}
                className={`w-full py-2 px-4 rounded ${registrationButtonState.className}`}
              >
                {registrationButtonState.text}
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

                {!eventToday && !eventDatePassed && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                    <p className="text-yellow-800 text-sm">
                      Attendance code can only be generated on the event day
                    </p>
                  </div>
                )}

                <button
                  onClick={handleGenerateAttendanceCode}
                  disabled={isGenerating || (!eventToday && !eventDatePassed)}
                  className={`w-full py-2 px-4 rounded ${
                    isGenerating || (!eventToday && !eventDatePassed)
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

              {!eventToday && !eventDatePassed && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-800 text-sm">
                    Attendance can only be marked on the event day
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={attendanceCodeInput}
                  onChange={(e) => setAttendanceCodeInput(e.target.value)}
                  placeholder="Enter attendance code"
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!eventToday && !eventDatePassed}
                />
                <button
                  onClick={handleVerifyAttendanceCode}
                  disabled={attendanceButtonState.disabled}
                  className={`w-full py-2 px-4 rounded ${attendanceButtonState.className}`}
                >
                  {attendanceButtonState.text}
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
