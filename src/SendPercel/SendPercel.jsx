import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const SendPercel = () => {
  const { user } = useAuth();
  const data = useLoaderData();
  const axiosSecure = useAxiosSecure();
  //   console.log("LOADER DATA:", data);
  //   console.table(data.map((d) => d.region));

  // Remove duplicate regions
  const regions = [...new Set(data.map((item) => item.region))];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [deliveryCost, setDeliveryCost] = useState(null);
  const type = watch("type");
  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");

  const generateTrackingId = () => {
    return "TRK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Get service centers from covered_area
  const getCenters = (region) => {
    if (!region) return [];
    const matched = data.filter((r) => r.region === region);
    const allCenters = matched.flatMap((r) => r.covered_area || []);
    return [...new Set(allCenters)];
  };
  const calculateCost = (formData) => {
    const isSameRegion = formData.sender_region === formData.receiver_region;
    const weight = parseFloat(formData.weight || 0);
    let base = 0,
      extra = 0,
      total = 0,
      description = "";

    if (formData.type === "document") {
      base = isSameRegion ? 60 : 80;
      description = `Document parcel (${
        isSameRegion ? "within" : "outside"
      } district)`;
    } else if (formData.type === "non-document") {
      if (weight <= 3) {
        base = isSameRegion ? 110 : 150;
        description = `Non-document up to 3kg (${
          isSameRegion ? "within" : "outside"
        } district)`;
      } else {
        base = isSameRegion ? 110 : 150;
        extra = (weight - 3) * 40 + (isSameRegion ? 0 : 40);
        description = `Non-document >3kg (${
          isSameRegion ? "within" : "outside"
        } district)`;
      }
    }

    total = base + extra;
    return { base, extra, total, description };
  };

  const onSubmit = (formData) => {
    const { base, extra, total, description } = calculateCost(formData);
    setDeliveryCost(total);

    Swal.fire({
      title: "📦 Delivery Cost Breakdown",
      html: `
      <p><strong>Parcel Type:</strong> ${formData.type}</p>
      <p><strong>From:</strong> ${formData.sender_region} → <strong>To:</strong> ${formData.receiver_region}</p>
      <p><strong>Description:</strong> ${description}</p>
      <hr/>
      <p>Base: ৳${base}</p>
      <p>Extra: ৳${extra}</p>
      <h3>Total: <strong style="color:#16a34a">৳${total}</strong></h3>
    `,
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Edit Info",
      confirmButtonColor: "#16a34a",
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...formData,
          delivery_cost: total,
          created_by_email: user?.email || "unknown",
          creation_date: new Date().toISOString(),
          created_at_human: new Date().toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          }),
          payment_status: "unpaid",
          delivery_status: "pending",
          tracking_id: generateTrackingId(),
        };

        console.log("Saving to DB:", parcelData);

        axiosSecure
          .post("/parcels", parcelData)
          .then((res) => {
            // here we could redirect to  a payment page or trigger a payment modal
            console.log(res.data);
            if (res.data.insertedId) {
              toast.success("Parcel submitted successfully!");
              // reset();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border border-blue-50 rounded-xl shadow">
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Send a Parcel</h1>
      <p className="text-gray-500 mb-6">
        Fill in the parcel, sender and receiver details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Parcel Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Type</label>
              <select
                className="select w-full"
                {...register("type", { required: true })}
              >
                <option value="">Select Type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-Document</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">Type is required</p>
              )}
            </div>

            <div>
              <label className="label">Title</label>
              <input
                className="input w-full"
                {...register("title", { required: true })}
                placeholder="Parcel Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Title is required</p>
              )}
            </div>

            {type === "non-document" && (
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input w-full"
                  {...register("weight")}
                  placeholder="e.g. 2.5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sender Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sender Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="input w-full"
              {...register("sender_name", { required: true })}
              defaultValue={user.displayName}
              readOnly
              placeholder="Sender Name"
            />

            <input
              className="input w-full"
              {...register("sender_contact", { required: true })}
              placeholder="Sender Contact"
            />

            <select
              className="select w-full"
              {...register("sender_region", { required: true })}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              className="select w-full"
              {...register("sender_center", { required: true })}
            >
              <option value="">Select Service Center</option>
              {(getCenters(senderRegion) || []).map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>

            <input
              className="input w-full"
              {...register("sender_address", { required: true })}
              placeholder="Sender Address"
            />

            <textarea
              className="textarea w-full"
              {...register("pickup_instruction", { required: true })}
              placeholder="Pick Up Instruction"
            ></textarea>
          </div>
        </div>

        {/* Receiver Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Receiver Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="input w-full"
              {...register("receiver_name", { required: true })}
              placeholder="Receiver Name"
            />

            <input
              className="input w-full"
              {...register("receiver_contact", { required: true })}
              placeholder="Receiver Contact"
            />

            <select
              className="select w-full"
              {...register("receiver_region", { required: true })}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              className="select w-full"
              {...register("receiver_center", { required: true })}
            >
              <option value="">Select Service Center</option>
              {(getCenters(receiverRegion) || []).map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>

            <input
              className="input w-full"
              {...register("receiver_address", { required: true })}
              placeholder="Receiver Address"
            />

            <textarea
              className="textarea w-full"
              {...register("delivery_instruction", { required: true })}
              placeholder="Delivery Instruction"
            ></textarea>
          </div>
        </div>

        <button className="btn btn-primary w-full text-black" type="submit">
          Submit Parcel
        </button>
      </form>
    </div>
  );
};

export default SendPercel;
