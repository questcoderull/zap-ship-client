import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: deliveries = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/completed?email=${user.email}`
      );
      return res.data;
    },
  });

  const handleCashOut = async (parcelId) => {
    const confirm = await Swal.fire({
      title: "Confirm Cashout?",
      text: "Do you want to cash out this earning?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);

        if (res.data.modifiedCount > 0) {
          Swal.fire("Success!", "Cashout completed successfully!", "success");
          refetch();
        } else {
          Swal.fire("Oops!", "Cashout failed. Try again.", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">✅ Completed Deliveries</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : deliveries.length === 0 ? (
        <p>No completed deliveries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Receiver</th>
                <th>To</th>
                <th>Fee (৳)</th>
                <th>Earned (৳)</th>
                <th>Status</th>
                <th>Cashout</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((parcel, index) => {
                const fee = Number(parcel.delivery_cost || 0);
                const isSameDistrict =
                  parcel.sender_region === parcel.receiver_region;
                const earned = isSameDistrict
                  ? Math.round(fee * 0.8)
                  : Math.round(fee * 0.3);

                return (
                  <tr key={parcel._id}>
                    <td>{index + 1}</td>
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.receiver_name}</td>
                    <td>{parcel.receiver_region}</td>
                    <td>৳{fee}</td>
                    <td>৳{earned}</td>
                    <td>
                      <span className="badge badge-success">Delivered</span>
                    </td>
                    <td>
                      {parcel.cashout_status === "cashed_out" ? (
                        <span className="text-green-600 font-semibold">
                          Cashed Out
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(parcel.cashed_out_at).toLocaleString()}
                          </span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCashOut(parcel._id)}
                          className="btn btn-sm btn-warning"
                        >
                          Cash Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
