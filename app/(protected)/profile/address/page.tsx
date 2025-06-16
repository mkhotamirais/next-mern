"use client";

import Pending from "@/components/Pending";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IAddress } from "@/lib/types";
import { axiosInstance, capitalize, errMsg } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteAddress from "./DeleteAddress";

export default function ProfileAddress() {
  const [data, setData] = useState<IAddress[]>([]);
  const [pendingData, setPendingData] = useState(false);

  const getData = async () => {
    try {
      setPendingData(true);
      const res = await axiosInstance.get("/user/account/address");
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (pendingData) return <Pending />;

  return (
    <div className="bg-card p-3 md:p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2">User Addresses</h2>
        <Link href="/profile/address/create">
          <Button>Create Address</Button>
        </Link>
      </div>
      <div>
        {data && data?.length === 0 ? (
          <h1>No addresses found</h1>
        ) : (
          data
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((address) => (
              <div key={address._id} className="mb-3 bg-secondary p-3 rounded-md">
                <h3 className="h3">
                  {address.label} - {address.fullAddress}
                </h3>
                <p className="capitalize">
                  {capitalize(address.village)}, Kec. {capitalize(address.district)},{capitalize(address.regency)},
                  Prov. {capitalize(address.province)}, {address.postalCode}
                </p>
                {address.isDefault && <Badge>Default Address</Badge>}
                <div className="flex gap-3">
                  <Link href={`/profile/address/edit/${address._id}`} className="text-green-500">
                    Edit
                  </Link>
                  <DeleteAddress address={address} getData={getData} />
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
