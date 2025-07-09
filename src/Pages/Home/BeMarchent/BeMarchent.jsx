import React from "react";
import locationMarch from "../../../assets/location-merchant.png";

const BeMarchent = () => {
  return (
    <div
      data-aos="fade-up"
      className=" bg-[#03373D] bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat   p-20 rounded-4xl"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={locationMarch} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn btn-primary text-black rounded-full">
            Become a Merchant
          </button>

          <button className="btn btn-outline text-primary rounded-full ml-4">
            Earn With Profast Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMarchent;
