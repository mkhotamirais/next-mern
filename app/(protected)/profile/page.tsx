"use client";

import ProfileData from "./ProfileData";

export default function Profile() {
  return (
    <section className="min-h-y py-4 bg-secondary">
      <div className="container">
        <div className="max-w-xl">
          <div className="mb-4">
            <h1 className="h1">Profile</h1>
          </div>
          <div className="flex flex-col gap-4">
            <ProfileData />
          </div>
        </div>
      </div>
    </section>
  );
}
