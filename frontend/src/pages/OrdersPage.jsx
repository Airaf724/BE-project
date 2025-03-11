import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, Truck, Loader } from "lucide-react";
import axios from "axios";

const OrdersTrackPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("../api/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const getProgress = (status) => {
    switch (status) {
      case "Pending":
        return 33;
      case "Shipped":
        return 66;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Track Your Orders</h2>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 border-b"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p className="text-gray-500">Status: {order.status}</p>
                </div>
                {order.status === "Shipped" ? (
                  <Truck className="text-blue-500 w-6 h-6" />
                ) : order.status === "Delivered" ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : (
                  <Package className="text-gray-500 w-6 h-6" />
                )}
              </div>
              <div className="relative pt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    className="bg-blue-500 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${getProgress(order.status)}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Pending</span>
                  <span>Shipped</span>
                  <span>Completed</span>
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
