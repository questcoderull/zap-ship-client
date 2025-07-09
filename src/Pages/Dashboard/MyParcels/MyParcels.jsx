import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      return res.data;
    },
  });

  console.log(parcels);

  const handleView = (parcel) => {
    Swal.fire({
      title: "Parcel Details",
      html: `
        <p><strong>Type:</strong> ${parcel.type}</p>
        <p><strong>Title:</strong> ${parcel.title}</p>
        <p><strong>Sender:</strong> ${parcel.sender_name}</p>
        <p><strong>Receiver:</strong> ${parcel.receiver_name}</p>
        <p><strong>Cost:</strong> ৳${parcel.delivery_cost}</p>
        <p><strong>Status:</strong> ${parcel.payment_status || "unpaid"}</p>
      `,
      confirmButtonText: "Close",
    });
  };

  const handlePay = (parcel) => {
    if (parcel.payment_status === "paid") return;

    navigate(`/dashboard/payment/${parcel._id}`);
    // Swal.fire({
    //   title: "Proceed to Payment?",
    //   text: `Total: ৳${parcel.delivery_cost}`,
    //   icon: "info",
    //   showCancelButton: true,
    //   confirmButtonText: "Pay Now",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     // Simulate payment (you can replace this)
    //     Swal.fire("Paid!", "Payment successful.", "success");

    //     // Update UI if needed (you may re-fetch or set state)
    //     console.log("Payment done for:", parcel._id);
    //   }
    // });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // ✅ Make DELETE request to your API
        axiosSecure.delete(`/parcels/${id}`).then((res) => {
          if (res.data.deletedCount) {
            Swal.fire("Deleted!", "Parcel has been removed.", "success");
          }
          refetch();
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Title</th> {/* ✅ New Title Column */}
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td className="capitalize">{parcel.type}</td>
              <td>{parcel.title}</td> {/* ✅ Show Title */}
              <td>{parcel.created_at_human}</td>
              <td>৳{parcel.delivery_cost}</td>
              <td>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
                </span>
              </td>
              <td className="flex gap-2 flex-wrap">
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => handleView(parcel)}
                >
                  View
                </button>
                <button
                  className="btn btn-sm btn-warning text-white"
                  onClick={() => handlePay(parcel)}
                  disabled={parcel.payment_status === "paid"}
                >
                  Pay
                </button>
                <button
                  className="btn btn-sm btn-error text-white"
                  onClick={() => handleDelete(parcel._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
