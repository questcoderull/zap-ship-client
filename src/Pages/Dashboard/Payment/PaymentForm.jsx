import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  // console.log(parcelId);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <span className="loading loading-spinner text-secondary"></span>;
  }

  // console.log(parcelInfo);
  const amount = parcelInfo.delivery_cost;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);

      //steps-2: create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      // steps-3 : confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // console.log("Payment succeeded!");
          // console.log(result);

          const transactionId = result.paymentIntent.id;
          // step-4: mark parcel paid also create payment history.
          const paymentData = {
            parcelId,
            created_by_email: user.email,
            amount,
            transactionId: transactionId,
            paymentMethod: result.paymentIntent.payment_method_types[0],
          };
          console.log(paymentData);
          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data.insertedId) {
            console.log("payment successfully");
            alert("Inserted ID found, Swal should fire now!");
            Swal.fire({
              title: "Payment Successful!",
              text: `Transaction ID: ${transactionId}`,
              icon: "success",
              confirmButtonText: "Go to My Parcels",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/myParcels");
              }
            });
          }
        }
      }

      console.log("res from intent", res);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>

        <button
          className="btn btn-primary text-black w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
