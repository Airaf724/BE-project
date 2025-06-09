import { useEffect } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, Truck, Loader } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { useParams } from "react-router-dom";

const OrdersTrackPage = () => {
  const { userId } = useParams();
  const { order, fetchUserById, isLoading, error } = useOrderStore();

  useEffect(() => {
    if (userId) fetchUserById(userId);
  }, [userId, fetchUserById]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!Array.isArray(order)) {
    console.error("Expected array but got:", order);
    return (
      <p className="text-red-500 text-center">Invalid order data received.</p>
    );
  }

  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return 33;
      case "processing":
        return 66;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Track Your Orders</h2>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {order.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          order.map((orderItem) => (
            <motion.div
              key={orderItem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 border-b space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order ID: {orderItem._id}</p>
                  <p className="text-gray-500">Status: {orderItem.status}</p>
                </div>
                {orderItem.status === "processing" ? (
                  <Truck className="text-blue-500 w-6 h-6" />
                ) : orderItem.status === "completed" ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : (
                  <Package className="text-gray-500 w-6 h-6" />
                )}
              </div>

              {/* Course Information */}
              <div className="flex gap-4 items-center">
                <img
                  src={orderItem.courseImage}
                  alt={orderItem.courseName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-sm">Course Name:</p>
                  <a
                    href={orderItem.courseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    {orderItem.courseName}
                  </a>
                </div>
              </div>

              {/* Fixed Progress Bar */}
              <div className="relative pt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    className="bg-blue-500 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${getProgress(orderItem.status)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Pending</span>
                  <span>Processing</span>
                  <span>Completed</span>
                </div>
              </div>

              {/* Additional Order Details */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Payment Status: </span>
                  <span
                    className={`${
                      orderItem.paymentStatus === "succeeded"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {orderItem.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Order Date: </span>
                  {new Date(orderItem.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTrackPage;
