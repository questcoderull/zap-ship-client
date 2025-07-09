// src/components/ClientLogos.jsx
import React from "react";
import Marquee from "react-fast-marquee";

import amazon from "../../../assets/brands/amazon.png";
import amazonVector from "../../../assets/brands/amazon_vector.png";
import casio from "../../../assets/brands/casio.png";
import moonstar from "../../../assets/brands/moonstar.png";
import randstad from "../../../assets/brands/randstad.png";
import startPeople from "../../../assets/brands/start-people 1.png";
import start from "../../../assets/brands/start.png";

const logos = [
  amazon,
  amazonVector,
  casio,
  moonstar,
  randstad,
  startPeople,
  start,
];

const ClientLogos = () => {
  return (
    <section className="pt-16 pb-5 bg-blue-400 rounded-4xl mb-10">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        We've helped thousands of sales teams
      </h2>

      <div className="bg-blue-50 rounded-3xl py-10 mx-5">
        <Marquee
          speed={100}
          gradient={false}
          pauseOnHover={true}
          direction="left"
          className="flex gap-10"
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="mx-16 flex items-center justify-center w-32 h-6"
            >
              <img
                src={logo}
                alt={`Client logo ${index}`}
                className="h-full object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default ClientLogos;
