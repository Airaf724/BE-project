import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuthStore();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = user?.notifications;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
      >
        <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="max-h-96 overflow-y-auto">
            {notifications?.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-xl">
                    {notification.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-gray-700">
                        {notification.message}
                        {notification.points && (
                          <span className="ml-2 text-orange-500">
                            +{notification.points}
                          </span>
                        )}
                        {notification.linkText && (
                          <a
                            href="#"
                            className="ml-2 text-blue-500 hover:underline"
                          >
                            {notification.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Mark all as read
            </button>
            <button className="p-1">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
