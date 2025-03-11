import { Order } from "../models/orders.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { name, email, phone, address, item } = req.body;
    if (!name || !email || !phone || !address || !item) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including item name",
      });
    }

    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      item, // Ensuring the item structure matches the schema
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "server error" });
  }
};
