import React, { useEffect, useRef, useState } from "react";
import hero_img from "../assets/Hero.png";
import hand_icon from "../assets/Assets/Frontend_Assets/hand_icon.png";
import arrow_icon from "../assets/Assets/Frontend_Assets/arrow.png";
import axios from "axios";
import { formatDate } from "../utils/Date";
import { Link } from "react-router-dom";
const Hero = () => {
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/events"
      : "/api";

  axios.defaults.withCredentials = true;

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const searchTimeout = useRef(null);
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!searchValue) {
      setSearchResult([]); // Clear results when input is empty
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.post(
          `${API_URL}/search?name=${searchValue}`
        );

        setSearchResult(response.data?.events || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(searchTimeout.current);
  }, [searchValue]);

  const trimDate = (date) => {
    date = formatDate(date);
    return date.split(",")[0];
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] pt-20">
      {/* Left Section - Full width on mobile, half width on desktop */}
      <div className="fixed top-20 right-20 opacity-90 z-10">
        <input
          type="text"
          value={searchValue}
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[350px] px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none"
        />

        {searchResult.length > 0 && (
          <div className="w-full bg-white border  border-gray-300 rounded-md shadow-md p-2 mt-2">
            {searchResult.map((event, index) => (
              <Link to={`/event/${event._id}`} key={index}>
                <div className="py-1 px-2 flex justify-between hover:bg-gray-100 cursor-pointer">
                  <span>{event.name}</span>
                  <span>{trimDate(event.event_date)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="w-full  md:w-1/2 flex flex-col justify-center p-6 md:pl-16">
        <h2 className="text-[#090909]  text-xl md:text-2xl font-semibold">
          Latest Events Near You!!
        </h2>
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <p className="text-[#171717] text-3xl md:text-4xl font-light">
              Upcoming Events
            </p>
            <img src={hand_icon} alt="Hand" className="w-16 md:w-24" />
          </div>
          <p className="text-[#171717] text-3xl md:text-5xl font-light">
            Grab the Opportunity!!
          </p>
          <p className="text-[#171717] text-3xl md:text-5xl font-light">
            Register Now!
          </p>
        </div>
        <div className="flex  items-center justify-start gap-4 mt-8 w-[200px] h-[50px] rounded-full bg-[#ff4141] text-white text-xl font-medium">
          <div className="ml-4">Latest Events</div>
          <img src={arrow_icon} alt="Arrow" />
        </div>
      </div>

      {/* Right Section - Full width on mobile, half width on desktop */}
      <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
        <img
          src={hero_img}
          alt="Hero"
          className="max-w-full md:max-w-[500px] h-auto"
        />
      </div>
    </div>
  );
};
export default Hero;
