import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { toast } from "react-toastify";

const ManageOrders = () => {
  const [credentials, setCredentials] = useState({});
  const { orders, fetchOrders, updateOrderStatus, isLoading, sendCredentials } =
    useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCredentialChange = (orderId, field, value) => {
    setCredentials({
      ...credentials,
      [orderId]: {
        ...(credentials[orderId] || {}),
        [field]: value,
      },
    });
  };

  const handleSendCredentials = async (order) => {
    // Get credentials from state or fallback to existing credentials
    const email =
      credentials[order._id]?.email || order.credentials?.email || "";
    const password =
      credentials[order._id]?.password || order.credentials?.password || "";

    if (!email || !password) {
      toast.error("Both email and password are required");
      return;
    }

    try {
      // Send credentials and update order status to completed
      const result = await sendCredentials(order._id, {
        email,
        password,
      });

      if (result && result.success) {
        toast.success("Credentials sent successfully!");
        // Clear credentials from local state
        const newCredentials = { ...credentials };
        delete newCredentials[order._id];
        setCredentials(newCredentials);
      } else {
        toast.error(result?.message || "Failed to send credentials");
      }
    } catch (error) {
      toast.error("An error occurred while sending credentials");
      console.error("Error sending credentials:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Course Credentials
      </h2>

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      )}

      <div className="space-y-4">
        {!isLoading &&
          orders
            ?.filter((order) => order.status !== "completed")
            .map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">{order.courseName}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ordered by:</p>
                    <p className="font-medium">{order.userName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.userEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Delivery Email:</p>
                    <p className="font-medium">
                      {order.credentials?.email || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Course Credentials
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Login Email:
                      </label>
                      <input
                        type="email"
                        value={
                          credentials[order._id]?.email ||
                          order.credentials?.email ||
                          ""
                        }
                        onChange={(e) =>
                          handleCredentialChange(
                            order._id,
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Course login email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password:
                      </label>
                      <input
                        type="text"
                        value={
                          credentials[order._id]?.password ||
                          order.credentials?.password ||
                          ""
                        }
                        onChange={(e) =>
                          handleCredentialChange(
                            order._id,
                            "password",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Course password"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendCredentials(order)}
                    disabled={isLoading}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Credentials to User
                  </button>
                </div>
              </div>
            ))}

        {!isLoading &&
          (!orders ||
            orders.filter((order) => order.status !== "completed").length ===
              0) && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No pending orders found.</p>
            </div>
          )}
      </div>

      {/* Completed Orders Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Completed Orders
        </h3>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credentials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!isLoading &&
                  orders
                    ?.filter((order) => order.status === "completed")
                    .map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.courseName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.credentials?.email &&
                          order.credentials?.password ? (
                            <span className="text-green-600">Sent</span>
                          ) : (
                            <span className="text-red-600">Not Sent</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.completedAt
                            ? new Date(order.completedAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}

                {!isLoading &&
                  (!orders ||
                    orders.filter((order) => order.status === "completed")
                      .length === 0) && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No completed orders.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
