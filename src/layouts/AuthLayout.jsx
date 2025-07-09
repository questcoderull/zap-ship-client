import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/authImage.png";
import ProFastLogo from "../Pages/Shared/proFastLogo/ProFastLogo";

const AuthLayout = () => {
  return (
    <div className=" bg-base-200 ">
      <ProFastLogo></ProFastLogo>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={authImg} className="max-w-sm rounded-lg shadow-2xl flex-1" />
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
