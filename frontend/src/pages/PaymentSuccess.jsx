import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    setSessionId(session_id);

    const verifyPayment = async () => {
      if (!session_id) {
        toast.error("Invalid session ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/payment/verify-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session_id,
              userId: user?._id,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setOrderDetails(data.order);
          toast.success("Payment successful!");
        } else {
          toast.error(data.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment");
      } finally {
        setIsLoading(false);
      }
    };

    if (session_id) {
      verifyPayment();
    } else {
      setIsLoading(false);
    }
  }, [searchParams, user]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        ) : orderDetails ? (
          <>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your purchase. Your course credentials will be
                sent to your email shortly.
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <p>Order ID:</p>
                <p>{orderDetails._id}</p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                <p>Course:</p>
                <p>{orderDetails.courseName}</p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                <p>Amount:</p>
                <p>${orderDetails.coursePoints}</p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                <p>Status:</p>
                <p className="text-green-600">Paid</p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                <p>Delivery Email:</p>
                <p>{orderDetails.credentials?.email}</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>
                Your course credentials will be sent to your email within 24
                hours. If you don't receive them, please contact our support
                team.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
              Payment Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">
              We couldn't verify your payment. Please contact support if you
              believe this is an error.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/rewards")}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Back to Rewards
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
