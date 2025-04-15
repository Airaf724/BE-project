import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/events"
    : "/api";

axios.defaults.withCredentials = true;

export const useEventStore = create((set) => ({
  events: [],
  event: null,
  error: null,
  isLoading: true,
  domainEvents: [],

  fetchEvents: async (collegeId, activeTab) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getevents`, {
        params: { collegeId, activeTab },
      });
      set({ events: response.data.events, isLoading: false });
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data?.message || error.message
      );
      set({ error: "Error fetching events", isLoading: false });
    }
  },

  fetchEventsByAdmin: async (adminId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/geteventsbyadmin`, {
        adminId,
      });
      set({ events: response.data.events, isLoading: false });
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data?.message || error.message
      );
      set({ error: "Error fetching events", isLoading: false });
    }
  },

  fetchEventById: async (eventId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/geteventsbyid`, {
        id: eventId,
      });
      set({ event: response.data.event, isLoading: false });
    } catch (error) {
      set({ error: "Error fetching events", isLoading: false });
    }
  },

  registerForEvent: async (eventId, userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/${eventId}/register`, {
        userId,
      });

      if (response.data.status === "Registered") {
        set((state) => ({
          events: state.events.map((event) =>
            event._id === eventId
              ? {
                  ...event,
                  registered: [...(event.registered || []), userId],
                }
              : event
          ),
        }));
      }

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error registering for event",
      });
      throw error;
    }
  },

  // In your event store
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();

      // Append event data to FormData consistently
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      formData.append("domain", eventData.domain);
      formData.append("location", eventData.location);
      formData.append("event_date", eventData.date); // Matches what controller expects
      formData.append("event_time", eventData.time); // Matches what controller expects
      formData.append("community", eventData.community);

      // Only append if they have values
      if (eventData.registrationReward) {
        formData.append("registrationReward", eventData.registrationReward);
      }
      if (eventData.attendanceReward) {
        formData.append("attendanceReward", eventData.attendanceReward);
      }

      // Only append collegeId once
      if (eventData.collegeId) {
        formData.append("collegeId", eventData.collegeId);
      }
      if (eventData.adminId) {
        formData.append("adminId", eventData.adminId);
      }

      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      // Make sure axios is imported
      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        events: [...state.events, response.data.event],
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      console.error("Error details:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error creating event",
      });
      throw error;
    }
  },

  fetchDomainEvents: async (domain) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getdomainevents/${domain}`);
      set({
        domainEvents: response.data.events || [],
        isLoading: false,
      });
    } catch (error) {
      // This will now only happen for network errors or 500 server errors
      set({
        error: "Error fetching events",
        isLoading: false,
        domainEvents: [], // Reset to empty array on error
      });
      console.error(error);
    }
  },

  updateEvent: async (eventId, eventData) => {
    set({ isLoading: true, error: null, updateSuccess: false });
    try {
      const response = await axios.put(
        `${API_URL}/updateevent/${eventId}`,
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update events list and current event
      set((state) => ({
        events: state.events.map((event) =>
          event.id === eventId ? response.data : event
        ),
        event: response.data,
        isLoading: false,
        updateSuccess: true,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update event",
        isLoading: false,
      });
      return null;
    }
  },
  resetEventStatus: () => {
    set({
      error: null,
      updateSuccess: false,
    });
  },

  deleteEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/deleteevent/${id}`);
      set({
        events: get().events.filter((event) => event._id !== id),
        loading: false,
      });
      return id;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete event",
        loading: false,
      });
    }
  },
}));

// registerForEvent: async (eventId, userId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/${eventId}/register`, {
//         userId,
//       });

//       // Update the event list with the new attendee
//       set((state) => ({
//         events: state.events.map((event) =>
//           event._id === eventId
//             ? { ...event, attendees: [...event.attendees, userId] }
//             : event
//         ),
//         isLoading: false,
//       }));

//       return response.data;
//     } catch (error) {
//       set({
//         isLoading: false,
//         error: error.response?.data?.message || "Error registering for event",
//       });
//       throw error;
//     }
//   },
