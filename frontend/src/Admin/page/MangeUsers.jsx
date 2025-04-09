import React, { useEffect } from "react";
import { useUserStore } from "../../store/userStore.js";
import { useAuthStore } from "../../store/authStore.js";
const MangeUsers = () => {
  const { users, fetchUsers } = useUserStore();
  const { user } = useAuthStore();

  console.log("user ,", user?.college);
  const collegeId = user?.college;

  useEffect(() => {
    fetchUsers(collegeId);
  }, []);
  return (
    <div className="flex-2 ml-64 p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Registered Users
      </h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border ">ERP</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="text-center border-t">
                <td className="py-2 px-4 border text-blue-600">
                  {user.profile.erp}
                </td>
                <td className={`py-2 px-4 border`}>{user.name}</td>
                <td className="py-2 px-4 border text-blue-600">{user.email}</td>
                <td className={`py-2 px-4 border`}>{user.profile.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MangeUsers;
