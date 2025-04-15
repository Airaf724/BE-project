import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import coin from "../assets/store/coin.png";

const OrderDetail = () => {
  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deliveryEmail, setDeliveryEmail] = useState(user?.email || "");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract query parameters
    const params = new URLSearchParams(location.search);
    const course = {
      id: params.get("id"), // This will be used as rewardId
      title: params.get("title"), // This will be used as courseName
      image: params.get("image"),
      points: params.get("points"), // This will be used as coursePoints
      link: params.get("courseLink") || "pending_assignment", // This will be used as courseLink
    };
    setSelectedCourse(course);
  }, [location]);
  console.log("selected course", selectedCourse);
  const handleRedeem = async () => {
    if (!selectedCourse) {
      toast.error("Course information is missing.");
      return;
    }

    if (!deliveryEmail) {
      toast.error(
        "Please enter the email where you want to receive the course credentials."
      );
      return;
    }

    if (!user?._id) {
      toast.error("You must be logged in to redeem a course.");
      return;
    }

    // Check if user has enough points
    if (user.points < Number(selectedCourse.points)) {
      toast.error("You don't have enough points to redeem this course.");
      return;
    }

    // Prepare order data according to the format expected by your API
    const orderData = {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      rewardId: selectedCourse.id,
      courseName: selectedCourse.title,
      coursePoints: Number(selectedCourse.points),
      courseLink: selectedCourse.link,
      courseImage: selectedCourse.image,
      credentials: {
        email: deliveryEmail,
      },
    };

    setLoading(true);
    try {
      const response = await placeOrder(orderData);

      if (response?.success) {
        toast.success(
          response.message ||
            "Course redemption successful! Credentials will be sent to your email within 24 hours."
        );
        setTimeout(() => {
          navigate("/rewards"); // Redirect to rewards page
        }, 2000); // Delay for better UX
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error redeeming course:", error);
      toast.error("Failed to redeem course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-6 min-h-screen">
      <div className="container max-w-3xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Redeem Udemy Course
          </h1>
        </div>

        {selectedCourse && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Course Preview */}
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 p-6">
                <div className="relative mb-4">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-m font-bold px-2 py-1 rounded-full flex items-center">
                    {selectedCourse.points}
                    <img src={coin} alt="coin" className="h-3 w-3 ml-1" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCourse.title}
                </h2>
                <p className="text-gray-600 flex items-center mt-2">
                  Points Required:
                  <span className="font-medium ml-1">
                    {selectedCourse.points}
                  </span>
                  <img src={coin} alt="coin" className="h-4 w-4 ml-1" />
                </p>
                <div className="mt-2 text-sm">
                  <span
                    className={`font-medium ${
                      user?.points >= Number(selectedCourse.points)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Available Balance: {user?.points || 0}
                    <img
                      src={coin}
                      alt="coin"
                      className="h-3 w-3 ml-1 inline"
                    />
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="w-full md:w-3/5 p-6 bg-gray-50">
                {/* Email Input */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">
                    Delivery Email Address:
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all duration-200"
                    placeholder="Enter email for course credentials"
                    value={deliveryEmail}
                    onChange={(e) => setDeliveryEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the email where you'll receive access credentials to
                    the Udemy course
                  </p>
                </div>

                {/* Course Details */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Redemption Information:
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    • After redemption, your request will be processed by our
                    team
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    • Course login credentials will be sent to your specified
                    email within 24 hours
                  </p>
                  <p className="text-sm text-gray-600">
                    • {selectedCourse.points} points will be deducted from your
                    account immediately
                  </p>
                </div>

                {/* User Details Preview */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Your Information:
                  </h3>
                  <p className="text-sm text-gray-600">Name: {user?.name}</p>
                  <p className="text-sm text-gray-600">
                    Account Email: {user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Points: {user?.points || 0}
                  </p>
                </div>

                {/* Redeem Button */}
                <button
                  onClick={handleRedeem}
                  disabled={
                    loading ||
                    !deliveryEmail ||
                    user?.points < Number(selectedCourse.points)
                  }
                  className={`w-full py-3 rounded-lg text-white font-bold ${
                    loading ||
                    !deliveryEmail ||
                    user?.points < Number(selectedCourse.points)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  } transition-colors duration-300`}
                >
                  {loading
                    ? "Processing..."
                    : user?.points < Number(selectedCourse.points)
                    ? "Not Enough Points"
                    : "Redeem Course"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedCourse && (
          <div className="text-center py-10 bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Course details not found. Please return to the rewards page.
            </p>
            <button
              onClick={() => navigate("/rewards")}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              Back to Rewards
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
