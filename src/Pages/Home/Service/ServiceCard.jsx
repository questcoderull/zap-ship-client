// src/components/ServiceCard.jsx
import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;

  return (
    <div className="bg-white hover:bg-green-300 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-center">
      <div className="flex justify-center text-4xl text-primary mb-4 mx-auto">
        {<Icon />}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
