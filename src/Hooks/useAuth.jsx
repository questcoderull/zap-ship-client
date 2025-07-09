import React, { use } from "react";
import { AuthoContext } from "../Contexts/AuthContext/AuthContext";

const useAuth = () => {
  const authInfo = use(AuthoContext);

  return authInfo;
};

export default useAuth;
