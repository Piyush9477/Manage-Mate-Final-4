import React, { useEffect, useState } from "react";
import socket from "../components/Socket"; // WebSocket instance
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const MeetingList = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [zoomJoinLink, setZoomJoinLink] = useState("");
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5001/meetings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMeetings(data);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      }
    };

    fetchMeetings();
  }, []);

  // Fetch users (excluding Managers)
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5001/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllUsers(data.filter((user) => user.role !== "Manager"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Listen for WebSocket meeting notifications
  useEffect(() => {
    const handleNewMeeting = (data) => {
      setMeetings((prev) => [...prev, data.meeting]);
    };

    socket.on("meetingNotification", handleNewMeeting);
    return () => socket.off("meetingNotification", handleNewMeeting);
  }, []);

  // Create new meeting
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedTime = new Date(scheduledTime).toISOString();

    const newMeeting = {
      title,
      scheduledTime: formattedTime,
      zoomJoinLink,
      participants,
    };

    try {
      const res = await fetch("http://localhost:5001/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMeeting),
      });

      const data = await res.json();
      setMeetings((prev) => [...prev, data.meeting]);

      // Reset form
      setTitle("");
      setScheduledTime("");
      setZoomJoinLink("");
      setParticipants([]);
    } catch (err) {
      console.error("Error creating meeting:", err);
    }
  };

  // Delete meeting
  const handleDeleteMeeting = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5001/meetings/${id}", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMeetings((prev) => prev.filter((m) => m._id !== id));
      } else {
        console.error("Failed to delete meeting");
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
    }
  };

  return (
    <div
      className={`p-4 ml-20 md:ml-64 shadow-md rounded transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {(user?.role === "Manager" || user?.role === "Project Leader") && (
        <>
          <h2 className="text-lg font-semibold mb-4">Schedule a New Meeting</h2>
          <form
            onSubmit={handleCreateMeeting}
            className={`mb-6 p-4 border rounded ${
              darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-100"
            }`}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium">Meeting Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Select Participants
              </label>
              <select
                multiple
                value={participants}
                onChange={(e) =>
                  setParticipants(
                    [...e.target.selectedOptions].map((opt) => opt.value)
                  )
                }
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                required
              >
                {allUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">
                Scheduled Time
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Zoom Join Link
              </label>
              <input
                type="url"
                value={zoomJoinLink}
                onChange={(e) => setZoomJoinLink(e.target.value)}
                className={`w-full p-2 border rounded ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Meeting
            </button>
          </form>
        </>
      )}

      <h2 className="text-lg font-semibold mb-2">Upcoming Meetings</h2>
      {meetings.length === 0 ? (
        <p>No scheduled meetings</p>
      ) : (
        <ul>
          {meetings.map((meeting) => (
            <li
              key={meeting._id}
              className={`border-b p-2 flex justify-between items-center ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}
            >
              <div>
                <h3 className="font-bold">{meeting.title}</h3>
                <p>
                  {meeting.scheduledTime
                    ? new Date(meeting.scheduledTime).toLocaleString()
                    : "Invalid Date"}
                </p>
                <button
                  onClick={() =>
                    window.open(
                      meeting.zoomJoinLink,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2"
                >
                  Join Meeting
                </button>
              </div>
              {(user?.role === "Manager" ||
                user?.role === "Project Leader") && (
                <button
                  onClick={() => handleDeleteMeeting(meeting._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-4"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetingList;