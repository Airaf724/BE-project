import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <XCircle className="text-red-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Payment Cancelled
      </h1>
      <p className="text-gray-600 mb-6">
        Your payment was not completed. You can try again or contact support.
      </p>
      <Link
        to="/rewards"
        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentCancelled;
