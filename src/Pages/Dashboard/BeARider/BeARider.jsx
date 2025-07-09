import React from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const BeARider = () => {
  const data = useLoaderData(); // contains service center data
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const regions = [...new Set(data.map((item) => item.region))];

  const getCenters = (region) => {
    const matched = data.filter((r) => r.region === region);
    const allCenters = matched.flatMap((r) => r.covered_area || []);
    return [...new Set(allCenters)];
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedRegion = watch("region");

  const onSubmit = async (formData) => {
    const application = {
      ...formData,
      email: user.email,
      name: user.displayName,
      application_status: "pending",
      applied_at: new Date(),
      applied_at_string: new Date().toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    try {
      const res = await axiosSecure.post("/riderApplications", application);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Application Submitted! ✅",
          text: "Your rider application has been received and is pending approval.",
          icon: "success",
          confirmButtonText: "Go to Dashboard",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard");
          }
        });
        // reset();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Submission Failed!",
        text: "Something went wrong while submitting your application.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl bg-white shadow">
      <h2 className="text-2xl font-bold mb-4">🚴 Apply to Be a Rider</h2>
      <p className="text-gray-500 mb-6">
        Fill out the form to become a verified rider.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-black">Name</label>
            <input
              className="input w-full"
              defaultValue={user.displayName}
              readOnly
            />
          </div>

          <div>
            <label className="label text-black">Email</label>
            <input
              className="input w-full"
              defaultValue={user.email}
              readOnly
            />
          </div>

          <div>
            <label className="label text-black">Phone Number</label>
            <input
              className="input w-full"
              {...register("phone", { required: true })}
              placeholder="e.g. 01712345678"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">Phone is required</span>
            )}
          </div>

          <div>
            <label className="label text-black">Age</label>
            <input
              type="number"
              className="input w-full"
              {...register("age", { required: true })}
              placeholder="e.g. 25"
            />
            {errors.age && (
              <span className="text-red-500 text-sm">Age is required</span>
            )}
          </div>

          <div>
            <label className="label text-black">Region</label>
            <select
              className="select w-full"
              {...register("region", { required: true })}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <span className="text-red-500 text-sm">Region is required</span>
            )}
          </div>

          <div>
            <label className="label text-black">
              District / Service Center
            </label>
            <select
              className="select w-full"
              {...register("district", { required: true })}
            >
              <option value="">Select District</option>
              {(getCenters(selectedRegion) || []).map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
            {errors.district && (
              <span className="text-red-500 text-sm">District is required</span>
            )}
          </div>

          <div>
            <label className="label text-black">National ID Number</label>
            <input
              className="input w-full"
              {...register("nid", { required: true })}
              placeholder="e.g. 1998456789002"
            />
            {errors.nid && (
              <span className="text-red-500 text-sm">NID is required</span>
            )}
          </div>

          <div>
            <label className="label text-black">Bike Brand</label>
            <input
              className="input w-full"
              {...register("bike_brand", { required: true })}
              placeholder="e.g. Honda, Yamaha"
            />
            {errors.bike_brand && (
              <span className="text-red-500 text-sm">
                Bike brand is required
              </span>
            )}
          </div>

          <div>
            <label className="label text-black">Bike Registration Number</label>
            <input
              className="input w-full"
              {...register("bike_registration", { required: true })}
              placeholder="e.g. DHAKA-METRO-XYZ-123"
            />
            {errors.bike_registration && (
              <span className="text-red-500 text-sm">
                Registration number is required
              </span>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full text-black">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;
