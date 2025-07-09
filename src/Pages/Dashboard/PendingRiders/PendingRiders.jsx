import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const { data: riders = [], refetch } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this rider application.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, not yet",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/approve/${id}`, {
        application_status: "active",
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire(
          "Approved!",
          "Rider has been approved successfully.",
          "success"
        );
        refetch();
      }
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel this rider application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/approve/${id}`, {
        application_status: "cancelled",
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire(
          "Cancelled!",
          "Rider application has been cancelled.",
          "info"
        );
        refetch();
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🚴 Pending Riders</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Phone</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.phone}</td>
                <td>{rider.applied_at_string}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(rider._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleCancel(rider._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🟨 Rider Detail Modal START */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-gray-800 rounded-lg p-6 w-[90%] max-w-lg relative shadow-lg">
            <button
              onClick={() => setSelectedRider(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-center text-gray-900">
              Rider Application Details
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.age}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nid}
              </p>
              <p>
                <strong>Bike Brand:</strong> {selectedRider.bike_brand}
              </p>
              <p>
                <strong>Bike Reg. Number:</strong> {selectedRider.bike_number}
              </p>
              <p>
                <strong>Status:</strong> {selectedRider.application_status}
              </p>
              <p>
                <strong>Applied At:</strong> {selectedRider.applied_at_string}
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => {
                  handleApprove(selectedRider._id);
                  setSelectedRider(null);
                }}
              >
                Approve
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => {
                  handleCancel(selectedRider._id);
                  setSelectedRider(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🟨 Rider Detail Modal END */}
    </div>
  );
};

export default PendingRiders;
