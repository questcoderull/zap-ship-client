import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState(null);

  const {
    data: deliveries = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/pending-tasks?email=${user.email}`
      );
      return res.data;
    },
  });

  const handleUpdateStatus = async (parcelId, newStatus) => {
    const actionText =
      newStatus === "in-transit" ? "mark as Picked Up" : "mark as Delivered";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoadingId(parcelId);
    try {
      const res = await axiosSecure.patch(
        `/parcels/update-status/${parcelId}`,
        {
          status: newStatus,
        }
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `Parcel marked as ${newStatus}`, "success");
        refetch();
      } else {
        Swal.fire("Error", "Update failed!", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📦 Pending Deliveries</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : deliveries.length === 0 ? (
        <p>No pending deliveries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Receiver</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>{parcel.receiver_contact}</td>
                  <td>{parcel.receiver_address}</td>
                  <td>{parcel.delivery_status}</td>
                  <td>
                    {parcel.delivery_status === "Rider_assigned" && (
                      <button
                        disabled={loadingId === parcel._id}
                        className="btn btn-sm btn-info"
                        onClick={() =>
                          handleUpdateStatus(parcel._id, "in-transit")
                        }
                      >
                        Mark as Picked Up
                      </button>
                    )}

                    {parcel.delivery_status === "in-transit" && (
                      <button
                        disabled={loadingId === parcel._id}
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          handleUpdateStatus(parcel._id, "delivered")
                        }
                      >
                        Mark as Delivered
                      </button>
                    )}
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

export default PendingDeliveries;
