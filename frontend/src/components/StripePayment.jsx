// components/StripePayment.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import axios from "axios";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#fa755a",
    },
  },
};

const StripePayment = ({
  orderId,
  payableAmount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { data } = await axios.post("/api/stripe/create-payment-intent", {
        orderId,
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        onPaymentError?.(result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        // Verify payment on backend
        const verifyResponse = await axios.post("/api/stripe/verify-payment", {
          paymentIntentId: result.paymentIntent.id,
          orderId,
        });

        if (verifyResponse.data.success) {
          toast.success("Payment successful!");
          onPaymentSuccess?.(result.paymentIntent);
        } else {
          throw new Error(verifyResponse.data.message);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
      onPaymentError?.(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold mb-2">
          Amount to Pay: ₹{payableAmount.toFixed(2)}
        </p>
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            processing || !stripe
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors duration-200`}
        >
          {processing ? "Processing..." : `Pay ₹${payableAmount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default StripePayment;
