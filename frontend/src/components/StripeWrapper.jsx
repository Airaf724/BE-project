// components/StripeWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51ROaQNRuScD7StXzJ0GRTe3Hk6r6Fp2s0bzVQQ2Roy5WQyqfBmLJQDpuPwQFUkLwNzlU7PNfZUJ4PhnnF9YD8qV900WYCLqNSh"
);
console.log("Stripe key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const StripeWrapper = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
