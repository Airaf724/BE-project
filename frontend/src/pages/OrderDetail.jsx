import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const [shirtSize, setShirtSize] = useState("M");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract query parameters
    const params = new URLSearchParams(location.search);
    const product = {
      id: params.get("id"),
      title: params.get("title"),
      image: params.get("image"),
      points: params.get("points"),
    };
    setSelectedProduct(product);
  }, [location]);

  const handleOrder = async () => {
    if (!selectedProduct || !address) {
      toast.error("Please enter a shipping address.");
      return;
    }

    const item = {
      name: selectedProduct?.title || "", // Ensure item name is valid
      size: shirtSize,
    };

    if (!item.name) {
      toast.error("Product name is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await placeOrder(
        user.name,
        user.email,
        user.profile.phone,
        address,
        item
      );

      console.log("Order Response:", response); // Debugging

      if (response?.success) {
        toast.success(response.message || "Order placed successfully!");
        setTimeout(() => {
          navigate("/"); // Redirect to home
        }, 2000); // Delay for better UX
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-start min-h-screen mx-auto p-6">
      <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white flex">
        {/* Product Details on Left */}
        {selectedProduct && (
          <div className="w-1/2 pr-4">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="w-full h-40 object-contain mb-4"
            />
            <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
            <p className="text-gray-600">
              Points Required: {selectedProduct.points}
            </p>
          </div>
        )}

        {/* Input Fields on Right */}
        <div className="w-1/2">
          {/* Shirt Size Selection (if T-shirt is selected) */}
          {selectedProduct?.title.includes("T-shirt") && (
            <div>
              <label className="block font-medium">Select Shirt Size:</label>
              <select
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => setShirtSize(e.target.value)}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          )}

          {/* Address Input */}
          <label className="block font-medium">Shipping Address:</label>
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows="3"
            placeholder="Enter your address..."
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Order Button */}
          <button
            onClick={handleOrder}
            disabled={loading}
            className={`w-full py-2 rounded text-white font-bold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
