"use client";

import Pending from "@/components/Pending";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { useCheckoutStore } from "@/lib/checkoutStore";
import { IAddress } from "@/lib/types";
import { axiosInstance, capitalize, errMsg } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function CheckoutAddress() {
  const [data, setData] = useState<IAddress[]>([]);
  const { setAddress, setSelectedAddressId } = useCheckoutStore();
  const { selectedItemIds } = useCartStore();
  const [pendingData, setPendingData] = useState(false);

  const router = useRouter();

  const getData = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/user/account/address");
      if (!res.data.length) {
        router.push("/profile/address/create");
        return;
      }
      setData(res.data);
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingData(false);
    }
  }, [router]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = data.find((address) => address._id === e.target.value);
    setSelectedAddressId(e.target.value);
    if (address) {
      setAddress(address);
    }

    const params = new URLSearchParams();
    selectedItemIds.forEach((id) => params.append("itemIds", id));
    router.push(`/products/checkout?${params.toString()}`);
  };

  if (pendingData) return <Pending />;

  return (
    <section className="section">
      <div className="container">
        <h1 className="h1">Checkout Address</h1>
        <div>
          {data.map((address, i) => (
            <label key={i} className="flex items-center border p-2 mb-2 gap-2">
              <div>
                <Input type="radio" name="address" value={address._id} onChange={onChange} className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{address.label}</div>
                <div className="text-sm text-muted-foreground">
                  {address.fullAddress}, {capitalize(address.village)}, {capitalize(address.district)},{" "}
                  {capitalize(address.regency)}, {capitalize(address.province)}, {address.postalCode}
                </div>
                {address.isDefault && <Badge>Default Address</Badge>}
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
