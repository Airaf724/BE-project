import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useOrderStore } from "../../store/orderStore";

const ManageOrders = () => {
  const [loading, setLoading] = useState(false);
  const { orders, fetchOrders, updateOrderInStore } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success("Order status updated!");
        updateOrderInStore(orderId, newStatus);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    // Main content area with left margin to account for sidebar
    <div className="ml-64 min-h-screen bg-gray-50">
      {/* Content wrapper with padding */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h2>

        {/* Orders grid with responsive columns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {order.name}
              </h3>

              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="text-gray-600">{order.email}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span>{" "}
                  <span className="text-gray-600">{order.phone}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  <span className="text-gray-600">{order.address}</span>
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              {loading && (
                <p className="text-blue-500 mt-4 text-sm">Updating...</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
