"use client";

import ProfileData from "./ProfileData";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

export default function Profile() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileData />
      <ChangePassword />
      <DeleteAccount />
    </div>
  );
}
