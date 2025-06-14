"use client";

import ProtectedRouteRoles from "@/layouts/ProtectedRouteRoles";
import ProfileData from "./ProfileData";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

export default function Profile() {
  return (
    <ProtectedRouteRoles authorizedRoles={["user", "editor", "admin"]}>
      <section className="min-h-y py-4 bg-secondary">
        <div className="container">
          <div className="max-w-xl">
            <div className="mb-4">
              <h1 className="h1">Profile</h1>
            </div>
            <div className="flex flex-col gap-4">
              <ProfileData />
              <ChangePassword />
              <DeleteAccount />
            </div>
          </div>
        </div>
      </section>
    </ProtectedRouteRoles>
  );
}
