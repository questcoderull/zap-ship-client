import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email], // ✅ FIXED
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`); // ✅
      // ✅ FIXED
      return res.data;
    },
    enabled: !!user?.email, // ✅ make sure query doesn't run until user is available
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">💳 Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-gray-500">No payment records found.</p>
      ) : (
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Payer Email</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment.transactionId || index}>
                <td>{index + 1}</td>
                <td className="font-mono text-sm text-blue-600">
                  {payment.transaction_id}
                </td>
                <td>৳{payment.amount}</td>
                <td className="capitalize">{payment.payment_method}</td>
                <td>{payment.created_by_email}</td>
                <td className="text-sm text-gray-600">
                  {new Date(
                    payment.createdAt || payment.date || Date.now()
                  ).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
