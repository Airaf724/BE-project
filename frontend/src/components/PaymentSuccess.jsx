import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Payment Successful
      </h1>
      <p className="text-gray-600 mb-6">
        Your payment has been received. You will receive your course credentials
        soon.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default PaymentSuccess;
