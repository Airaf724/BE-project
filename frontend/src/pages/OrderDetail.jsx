import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import StripeWrapper from "../components/StripeWrapper";
import StripePayment from "../components/StripePayment";
import coin from "../assets/store/coin.png";

const OrderDetail = () => {
  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deliveryEmail, setDeliveryEmail] = useState(user?.email || "");
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentCalculation, setPaymentCalculation] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract query parameters
    const params = new URLSearchParams(location.search);
    const course = {
      id: params.get("id"),
      title: params.get("title"),
      image: params.get("image"),
      points: parseInt(params.get("points")) || 0,
      price: parseInt(params.get("price")) || 500,
      link: params.get("courseLink") || "pending_assignment",
    };

    if (course.id && course.title) {
      setSelectedCourse(course);
      calculatePayment(course, user?.points || 0);
    } else {
      toast.error("Invalid course parameters");
      navigate("/store");
    }
  }, [location, user?.points, navigate]);

  const calculatePayment = (course, userPoints) => {
    if (!course) return;

    const coursePrice = Number(course.price);
    const coursePoints = Number(course.points);
    const coinValue = coursePoints > 0 ? coursePrice / coursePoints : 0;
    const maxCoinsToUse = Math.min(userPoints, coursePoints);
    const coinDiscount = maxCoinsToUse * coinValue;
    const payableAmount = Math.max(0, coursePrice - coinDiscount);

    setPaymentCalculation({
      coursePrice,
      coursePoints,
      coinValue,
      maxCoinsToUse,
      coinDiscount,
      payableAmount,
      requiresPayment: payableAmount > 0,
    });
  };

  const handleRedeem = async () => {
    if (!selectedCourse) {
      toast.error("Course information is missing.");
      return;
    }

    if (!deliveryEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!user?._id) {
      toast.error("You must be logged in to redeem a course.");
      return;
    }

    // Check if user has enough points for the minimum requirement
    const minPointsRequired = Math.min(
      Number(selectedCourse.points),
      user.points
    );
    if (
      user.points < minPointsRequired &&
      paymentCalculation?.payableAmount === paymentCalculation?.coursePrice
    ) {
      toast.error("You need at least some points to redeem this course.");
      return;
    }

    const orderPayload = {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      rewardId: selectedCourse.id,
      courseName: selectedCourse.title,
      coursePoints: Number(selectedCourse.points),
      coursePrice: Number(selectedCourse.price),
      courseLink: selectedCourse.link,
      courseImage: selectedCourse.image,
      credentials: {
        email: deliveryEmail.trim(),
      },
    };

    setLoading(true);
    try {
      const response = await placeOrder(orderPayload);

      if (response?.success) {
        setOrderData(response.orderData);

        if (response.orderData.requiresPayment) {
          setShowPayment(true);
          toast.info("Please complete the payment to proceed.");
        } else {
          toast.success(
            "Course redeemed successfully! Credentials will be sent to your email within 24 hours."
          );
          setTimeout(() => {
            navigate("/orders");
          }, 2000);
        }
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error redeeming course:", error);
      toast.error("Failed to redeem course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    toast.success(
      "Payment successful! Your course will be processed within 24 hours."
    );
    setTimeout(() => {
      navigate("/orders");
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
    setShowPayment(false); // Allow user to try again
  };

  const handleCheckoutPayment = async () => {
    if (!orderData?.orderId) {
      toast.error("Order ID is missing. Please try again.");
      return;
    }

    setCheckoutLoading(true);
    try {
      // Updated API call to match your backend structure
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              user?.token || localStorage.getItem("token")
            }`, // Add auth if required
          },
          body: JSON.stringify({
            orderId: orderData.orderId,
            amount: paymentCalculation?.payableAmount,
            currency: "inr",
            courseName: selectedCourse?.title,
            userEmail: user?.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleBackToOrder = () => {
    setShowPayment(false);
    setOrderData(null);
  };

  if (showPayment && orderData) {
    return (
      <div className="flex justify-center py-6 min-h-screen bg-gray-50">
        <div className="container max-w-2xl px-4">
          <div className="mb-6">
            <button
              onClick={handleBackToOrder}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Back to Order Details
            </button>
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Complete Payment
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {selectedCourse?.title}
              </h2>

              {/* Payment Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Payment Breakdown:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Course Price:</span>
                    <span>₹{paymentCalculation?.coursePrice}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Coins Used: {paymentCalculation?.maxCoinsToUse}</span>
                    <span>
                      -₹{paymentCalculation?.coinDiscount?.toFixed(2)}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Amount to Pay:</span>
                    <span className="text-blue-600">
                      ₹{paymentCalculation?.payableAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">
                  Choose Payment Method:
                </h3>

                {/* Stripe Checkout */}
                <button
                  onClick={handleCheckoutPayment}
                  disabled={checkoutLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200 flex items-center justify-center"
                >
                  {checkoutLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Checkout...
                    </>
                  ) : (
                    "Pay with Stripe Checkout"
                  )}
                </button>

                {/* Or Divider */}
                <div className="flex items-center my-4">
                  <hr className="flex-1" />
                  <span className="px-4 text-gray-500 text-sm">OR</span>
                  <hr className="flex-1" />
                </div>

                {/* Inline Payment Form */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-4">Pay with Card</h4>
                  <StripeWrapper>
                    <StripePayment
                      orderId={orderData.orderId}
                      payableAmount={paymentCalculation?.payableAmount || 0}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      courseName={selectedCourse?.title}
                      userEmail={deliveryEmail}
                    />
                  </StripeWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6 min-h-screen bg-gray-50">
      <div className="container max-w-3xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Redeem Udemy Course
          </h1>
        </div>

        {selectedCourse && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 p-6">
                <div className="relative mb-4">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/200"; // Fallback image
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center">
                    {selectedCourse.points}
                    <img src={coin} alt="coin" className="h-3 w-3 ml-1" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedCourse.title}
                </h2>
                <p className="text-gray-600 flex items-center mt-2">
                  Original Price: ₹{paymentCalculation?.coursePrice}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  Points Required:
                  <span className="font-medium ml-1">
                    {selectedCourse.points}
                  </span>
                  <img src={coin} alt="coin" className="h-4 w-4 ml-1" />
                </p>
                <div className="mt-2 text-sm">
                  <span
                    className={`font-medium ${
                      user?.points >= paymentCalculation?.maxCoinsToUse
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

                {/* Payment Calculation Display */}
                {paymentCalculation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Payment Details:
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Course Price:</span>
                        <span>₹{paymentCalculation.coursePrice}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Coins Discount:</span>
                        <span>
                          -₹{paymentCalculation.coinDiscount?.toFixed(2)}
                        </span>
                      </div>
                      <hr className="my-1" />
                      <div className="flex justify-between font-medium text-blue-800">
                        <span>Final Amount:</span>
                        <span>
                          {paymentCalculation.payableAmount > 0
                            ? `₹${paymentCalculation.payableAmount.toFixed(2)}`
                            : "FREE"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="w-full md:w-3/5 p-6 bg-gray-50">
                {/* Email Input */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-2">
                    Delivery Email Address: *
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none transition-all duration-200"
                    placeholder="Enter email for course credentials"
                    value={deliveryEmail}
                    onChange={(e) => setDeliveryEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Course credentials will be sent to this email address
                  </p>
                </div>

                {/* Course Details */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Redemption Information:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Request processed within 24 hours</li>
                    <li>• Course credentials sent to specified email</li>
                    <li>
                      • {paymentCalculation?.maxCoinsToUse || 0} coins will be
                      deducted
                    </li>
                    {paymentCalculation?.requiresPayment && (
                      <li className="text-blue-600 font-medium">
                        • Additional payment of ₹
                        {paymentCalculation.payableAmount?.toFixed(2)} required
                      </li>
                    )}
                  </ul>
                </div>

                {/* User Details Preview */}
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Your Information:
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Name: {user?.name}</p>
                    <p>Account Email: {user?.email}</p>
                    <p>Available Points: {user?.points || 0}</p>
                  </div>
                </div>

                {/* Redeem Button */}
                <button
                  onClick={handleRedeem}
                  disabled={
                    loading ||
                    !deliveryEmail.trim() ||
                    !selectedCourse ||
                    (user?.points === 0 && paymentCalculation?.coursePrice > 0)
                  }
                  className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 ${
                    loading ||
                    !deliveryEmail.trim() ||
                    !selectedCourse ||
                    (user?.points === 0 && paymentCalculation?.coursePrice > 0)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : !deliveryEmail.trim() ? (
                    "Enter Email Address"
                  ) : paymentCalculation?.requiresPayment ? (
                    `Proceed to Payment (₹${paymentCalculation.payableAmount?.toFixed(
                      2
                    )})`
                  ) : (
                    "Redeem Course (FREE)"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedCourse && (
          <div className="text-center py-10 bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 mb-4">
              Course details not found. Please return to the store.
            </p>
            <button
              onClick={() => navigate("/store")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
