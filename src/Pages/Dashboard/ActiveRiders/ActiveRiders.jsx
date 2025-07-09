import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  // Load active riders
  const {
    data: riders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/activeRiders?status=active");
      return res.data;
    },
  });

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to deactivate this rider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/approve/${id}`, {
        application_status: "deactive",
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
        refetch();
      }
    }
  };

  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🚴 Active Riders</h2>

      {/* Search Input */}
      <div className="form-control mb-4 max-w-xs">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {filteredRiders.length === 0 ? (
        <p className="text-gray-500">No active riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Bike</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td className="text-sm">{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.bike_brand}</td>
                  <td>
                    <span className="badge badge-success capitalize">
                      {rider.application_status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error text-white"
                      onClick={() => handleDeactivate(rider._id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
