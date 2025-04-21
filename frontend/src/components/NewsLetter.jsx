import React, { useState } from "react";
import { useUserStore } from "../store/userStore";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const { subscribeNewsletter } = useUserStore();
  const { user } = useUserStore();

  const handleSubmit = async () => {
    if (!email) return alert("Please enter an email address.");

    try {
      await subscribeNewsletter(email, user?.name);
      toast.success("Successfully subscribed to the newsletter!");
      setEmail(""); // Reset input
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div
      className="w-[95%] h-[45vh] flex flex-col items-center justify-center mx-auto px-[140px] mb-[150px] gap-[30px] bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22]
      max-[1280px]:px-[80px] max-[1280px]:mb-[120px] max-[1280px]:gap-[20px]
      max-[1024px]:mb-[60px]
      max-[800px]:mb-[30px] max-[800px]:h-[35vh]
      max-[500px]:h-[25vh] max-[500px]:w-full max-[500px]:px-0 max-[500px]:gap-[20px]"
    >
      <h1
        className="text-[#454545] text-[45px] font-medium
        max-[1280px]:text-[36px] max-[1280px]:font-light
        max-[1024px]:text-[30px]
        max-[800px]:text-[25px] max-[800px]:font-extralight
        max-[500px]:text-[20px]"
      >
        Get Exclusive Offers on your Email!
      </h1>
      <p
        className="text-[#454545] text-[20px] -mt-[20px]
        max-[1280px]:text-[18px]
        max-[1024px]:text-[16px]
        max-[800px]:text-[14px]
        max-[500px]:text-[13px] max-[500px]:max-w-[200px] max-[500px]:text-center"
      >
        Subscribe to our newsletter and stay updated!
      </p>
      <div
        className="flex items-center justify-between bg-white w-[730px] h-[50px] border border-[#e3e3e3] rounded-[30px]
        max-[1280px]:w-[600px]
        max-[1024px]:w-[500px] max-[1024px]:h-[40px]
        max-[800px]:w-[400px] max-[800px]:h-[30px]
        max-[500px]:w-[290px]"
      >
        <input
          type="email"
          placeholder="Your Email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[500px] ml-[30px] border-none outline-none text-[#616161] text-[16px] font-['Poppins']
            max-[1280px]:w-[400px]
            max-[1024px]:w-[400px]
            max-[800px]:w-[200px]
            max-[500px]:w-[130px]"
        />
        <button
          onClick={handleSubmit}
          className="w-[150px] h-[50px] rounded-[80px] bg-black text-white cursor-pointer text-[16px]
          max-[1280px]:w-[140px]
          max-[1024px]:w-[120px] max-[1024px]:h-[40px]
          max-[800px]:w-[100px] max-[800px]:h-[30px]
          max-[500px]:w-[90px]"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
