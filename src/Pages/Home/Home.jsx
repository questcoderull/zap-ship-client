import React from "react";
import Banner from "./Banner/Banner";
import Services from "./Service/Services";
import ClientLogos from "./ClientLogos/ClientLogos";
import BenefitsCard from "./Benefits/BenefitsCard";
import BeMarchent from "./BeMarchent/BeMarchent";

const Home = () => {
  return (
    <div>
      <Banner></Banner>

      <Services></Services>

      <ClientLogos></ClientLogos>

      <BenefitsCard></BenefitsCard>
      <BeMarchent></BeMarchent>
    </div>
  );
};

export default Home;
