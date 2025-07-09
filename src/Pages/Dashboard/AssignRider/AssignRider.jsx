import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedParcels, setAssignedParcels] = useState([]);

  const { data: parcels = [], isLoading: parcelsLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels/assignable?payment_status=paid&delivery_status=not_collected"
      );
      return res.data;
    },
  });

  const {
    data: riders = [],
    isLoading: ridersLoading,
    refetch: refetchRiders,
  } = useQuery({
    queryKey: ["availableRiders", selectedParcel?.sender_center],
    enabled: !!selectedParcel,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders?district=${selectedParcel.sender_center}`
      );
      return res.data;
    },
  });

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
    refetchRiders();
  };

  const handleAssignToRider = async (rider) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to assign this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, assign",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/parcels/assign-rider/${selectedParcel._id}`, {
          riderId: rider._id,
          riderName: rider.name,
          riderEmail: rider.email,
        });

        Swal.fire({
          icon: "success",
          title: "Rider Assigned!",
          text: "The rider has been successfully assigned.",
          timer: 2000,
          showConfirmButton: false,
        });

        setAssignedParcels((prev) => [...prev, selectedParcel._id]);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error assigning rider:", error);
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Could not assign rider. Try again.",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        📦 Assign Rider to Parcels
      </h2>

      {parcelsLoading ? (
        <p>Loading parcels...</p>
      ) : parcels.length === 0 ? (
        <p>No parcels available to assign.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Parcel ID</th>
                <th>Recipient</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Delivery Status</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel._id}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>{parcel.receiver_contact}</td>
                  <td>{parcel.receiver_address}</td>
                  <td>{parcel.delivery_status}</td>
                  <td>{parcel.payment_status}</td>
                  <td>
                    <button
                      disabled={assignedParcels.includes(parcel._id)}
                      className="btn btn-sm btn-primary text-black disabled:opacity-60"
                      onClick={() => handleAssignClick(parcel)}
                    >
                      {assignedParcels.includes(parcel._id) ? (
                        <span className="text-green-600 font-bold">
                          Assigned
                        </span>
                      ) : (
                        <>
                          <FaUserPlus className="inline mr-1" />
                          Assign Rider
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl text-black font-semibold mb-4">
              Assign Rider to Parcel: <br />
              <span className="text-sm text-black">{selectedParcel._id}</span>
            </h3>
            {ridersLoading ? (
              <p className="text-black">Loading riders...</p>
            ) : riders.length === 0 ? (
              <p className="text-black">
                No riders found in {selectedParcel.sender_center}.
              </p>
            ) : (
              <ul className="space-y-2">
                {riders.map((rider) => (
                  <li
                    key={rider._id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-semibold">{rider.name}</p>
                      <p className="text-sm text-black">{rider.email}</p>
                      <p className="text-sm text-black">
                        Center: {rider.district}
                      </p>
                    </div>
                    <button
                      className="btn btn-sm btn-success text-white"
                      onClick={() => handleAssignToRider(rider._id)}
                    >
                      Confirm
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
