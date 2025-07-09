import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = "user",
    isLoading: roleLoading,
    isError,
    error,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      return res.data.role;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { role, roleLoading, isError, error, isFetching, isSuccess };
};

export default useUserRole;
