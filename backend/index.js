import express from "express";
import { connectDb } from "./db/connectDb.js";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js";
import eventroutes from "./routes/event.routes.js";
import userroutes from "./routes/user.routes.js";
import orderroutes from "./routes/order.routes.js";
import rewardroutes from "./routes/reward.routes.js";
import collegeroutes from "./routes/college.routes.js";
import attendanceroutes from "./routes/attendance.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
dotenv.config();
const app = express();
const __dirname = path.resolve();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authroutes);
app.use("/api/events", eventroutes);
app.use("/api/users", userroutes);
app.use("/api/orders", orderroutes);
app.use("/api/colleges", collegeroutes);
app.use("/api/rewards", rewardroutes);
app.use("/api/attendance", attendanceroutes);
app.use("/api/stripe", stripeRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Add this after all your routes are registered
// Add this BEFORE your routes in index.js
app.use((req, res, next) => {
  if (req.url.includes("/api/stripe/create-payment-intent")) {
    console.log("🔍 Payment Intent Request:", {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
  }
  next();
});
app.listen(PORT, () => {
  connectDb();
  console.log("server started at port ", PORT);
});
