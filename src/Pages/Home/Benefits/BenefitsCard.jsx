import React from "react";
import liveTracking from "../../../assets/live-tracking.png";
import safeDelivery from "../../../assets/safe-delivery.png";

const benefitsData = [
  {
    id: 1,
    image: liveTracking,
    title: "Fast & Reliable",
    description:
      "Experience lightning-fast delivery with reliability you can trust, every single time.",
  },
  {
    id: 2,
    image: safeDelivery,
    title: "Secure Payment",
    description:
      "All transactions are encrypted and 100% secure to keep your money safe.",
  },
  {
    id: 3,
    image: safeDelivery,
    title: "Easy Tracking",
    description:
      "Monitor your shipment in real-time and never lose sight of your parcels again.",
  },
];

const BenefitsCard = () => {
  return (
    <div className="my-12 px-4 md:px-20">
      <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us</h2>
      <div className="flex flex-col gap-8">
        {benefitsData.map(({ id, image, title, description }) => (
          <div
            key={id}
            className="card lg:flex-row flex flex-col bg-base-100 shadow-xl overflow-hidden"
          >
            {/* Left Image */}
            <div className="lg:w-1/4 w-full p-4">
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            {/* Vertical Divider on lg screens */}
            <div className="hidden lg:flex items-center">
              <div className="w-px h-40 bg-gray-300 mx-4" />
            </div>

            {/* Right Content */}
            <div className="lg:w-3/4 w-full p-4 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsCard;
