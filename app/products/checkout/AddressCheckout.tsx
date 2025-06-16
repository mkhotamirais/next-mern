"use client";

import { useCheckoutStore } from "@/lib/checkoutStore";
import { IAddress } from "@/lib/types";
import { axiosInstance, capitalize, errMsg } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AddressCheckout() {
  const { address, setAddress, selectedAddressId } = useCheckoutStore();
  const [pendingAddress, setPendingAddress] = useState(false);

  const router = useRouter();

  const getAddress = useCallback(async () => {
    try {
      setPendingAddress(true);
      const res = await axiosInstance.get("/user/account/address");
      const defaultAddress = res.data.find((addr: IAddress) => addr.isDefault);
      const selectedAddressById = res.data.find((addr: IAddress) => addr._id === selectedAddressId);

      if (defaultAddress) {
        if (selectedAddressId) {
          setAddress(selectedAddressById);
        } else {
          setAddress(defaultAddress);
        }
      } else {
        router.push("/products/checkout/address");
      }
    } catch (error) {
      errMsg(error);
    } finally {
      setPendingAddress(false);
    }
  }, [setAddress, router, selectedAddressId]);

  useEffect(() => {
    getAddress();
  }, [getAddress]);

  if (pendingAddress) return <div>Pending address...</div>;

  if (!address) return null;
  else
    return (
      <div>
        {address ? (
          <div className="mb-6 border p-4 rounded flex">
            <Link href="/products/checkout/address">
              <div className="font-semibold">{address.label}</div>
              <div>
                {address.fullAddress}, {capitalize(address?.village)}, Kec. {capitalize(address?.district)},{" "}
                {capitalize(address?.regency)}, Prov. {capitalize(address?.province)}, {address.postalCode}
              </div>
              <div className="text-sm mt-1 text-gray-500">📍 Alamat pengiriman</div>
            </Link>
            <ChevronRight size={32} />
          </div>
        ) : (
          <div className="mb-6 border p-4 rounded">
            <div className="font-semibold">Pilih alamat</div>
            <div className="text-sm mt-1 text-gray-500">📍 Alamat pengiriman</div>
          </div>
        )}
      </div>
    );
}
