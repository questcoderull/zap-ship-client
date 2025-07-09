import React from "react";
import { Link } from "react-router";
import { FaBan } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
        <FaBan className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
        <Link to="/" className="btn btn-primary text-black">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
