"use client";

import Loading from "@/app/loading";
import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import { IUser } from "@/lib/types";
import { axiosInstance } from "@/lib/utils";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPending(true);
    const getUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        setUsers(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error);
          setError(error?.response?.data?.message);
        }
      } finally {
        setPending(false);
      }
    };
    getUsers();
  }, []);

  if (pending) return <Loading />;
  if (error) return <h1>{error}</h1>;

  return (
    <ProtectedRouteRoles authorizedRoles={["admin"]}>
      <section className="min-h-y py-4 bg-secondary">
        <div className="container">
          <div>
            <h1 className="h1">Users</h1>
            <div>
              {users?.map((user) => (
                <div key={user._id}>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
