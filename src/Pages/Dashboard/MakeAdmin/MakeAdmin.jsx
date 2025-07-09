import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Live search with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      const fetchUser = async () => {
        if (!searchEmail.trim()) {
          setFoundUsers([]);
          return;
        }

        try {
          setLoading(true);
          const res = await axiosSecure.get(
            `/users/search?email=${searchEmail}`
          );
          setFoundUsers(res.data || null);
        } catch (err) {
          setFoundUsers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, 500); // 500ms delay

    return () => clearTimeout(delay); // cleanup
  }, [searchEmail, axiosSecure]);

  const updateRole = async (email, newRole) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to make this user ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.patch(`/users/role/${email}`, {
        role: newRole,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `User is now ${newRole}`, "success");
        setFoundUser({ ...foundUser, role: newRole });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded bg-white">
      <h2 className="text-2xl font-semibold mb-4">🔐 Manage Admin Access</h2>
      <input
        type="text"
        placeholder="Enter email to search"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="input input-bordered w-full mb-4"
      />

      {loading && <p className="text-sm text-gray-500">Searching...</p>}

      {foundUsers.length > 0 && (
        <div className="space-y-4">
          {foundUsers.map((user) => (
            <div key={user._id} className="border rounded p-4 bg-base-100">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role || "user"}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {user.created_at
                  ? new Date(user.created_at).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </p>

              <div className="mt-4 flex gap-2">
                {user.role === "admin" ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => updateRole(user.email, "user")}
                  >
                    Remove Admin
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => updateRole(user.email, "admin")}
                  >
                    Make Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
