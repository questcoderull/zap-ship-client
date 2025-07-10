import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["riderEarnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider-earnings?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const cards = [
    {
      label: "👑 Overall Earnings",
      value: stats.overall,
      color: "bg-gradient-to-r from-amber-600 to-yellow-500 text-black",
      bold: true,
    },

    { label: "Total Earnings", value: stats.total, color: "bg-[#1E3A8A]" },
    { label: "Cashed Out", value: stats.cashed_out, color: "bg-[#065F46]" },
    { label: "Pending", value: stats.pending, color: "bg-[#92400E]" },
    { label: "Today", value: stats.today, color: "bg-[#6D28D9]" },
    { label: "This Week", value: stats.week, color: "bg-[#B91C1C]" },
    { label: "This Month", value: stats.month, color: "bg-[#0E7490]" },
    { label: "This Year", value: stats.year, color: "bg-[#4B5563]" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        💰 My Earnings Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.color} text-white p-6 rounded-lg shadow-md ${
              card.bold ? "col-span-full text-center" : ""
            }`}
          >
            <p className="text-sm font-medium opacity-90">{card.label}</p>
            <h3 className="text-2xl font-extrabold mt-1">{card.value}৳</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEarnings;
