"use client";

import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import Pending from "@/components/Pending";
import { Button } from "@/components/ui/button";
import { useAddressStore } from "@/lib/addressStore";
import { usePersistedState } from "@/lib/useHook";
import { axiosInstance } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const initialForm = {
  label: "",
  provinceId: "",
  regencyId: "",
  districtId: "",
  villageId: "",
  postalCode: "",
  fullAddress: "",
  isDefault: false,
};

export default function CreateAddress() {
  const {
    provinces,
    setProvinces,
    pendingProvince,
    setPendingProvince,
    regencies,
    setRegencies,
    districts,
    setDistricts,
    villages,
    setVillages,
  } = useAddressStore();

  const [form, setForm] = usePersistedState("addressForm", initialForm);

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);

  const router = useRouter();

  const fetchProvinces = useCallback(async () => {
    try {
      setPendingProvince(true);
      const res = await axios.get("/api/wilayah?type=provinces");
      const mapped = res.data.map((prov: { id: string; name: string }) => ({
        value: prov.id,
        label: prov.name,
      })) as { value: string; label: string }[];

      const formattedProvinces = mapped.sort((a, b) => a.label.localeCompare(b.label));
      setProvinces(formattedProvinces);
    } catch (error) {
      console.error("Gagal mengambil provinsi", error);
    } finally {
      setPendingProvince(false);
    }
  }, [setProvinces, setPendingProvince]);

  const fetchRegency = useCallback(async () => {
    const res = await axios.get(`/api/wilayah?type=regencies&provinceId=${form.provinceId}`);
    const mapped = res.data.map((reg: { id: string; name: string }) => ({
      value: reg.id,
      label: reg.name,
    })) as { value: string; label: string }[];

    const formattedRegencies = mapped.sort((a, b) => a.label.localeCompare(b.label));
    setRegencies(formattedRegencies);
  }, [form.provinceId, setRegencies]);

  const fetchDistrict = useCallback(async () => {
    const res = await axios.get(`/api/wilayah?type=districts&regencyId=${form.regencyId}`);
    const mapped = res.data.map((dist: { id: string; name: string }) => ({
      value: dist.id,
      label: dist.name,
    })) as { value: string; label: string }[];

    const formattedDistricts = mapped.sort((a, b) => a.label.localeCompare(b.label));
    setDistricts(formattedDistricts);
  }, [form.regencyId, setDistricts]);

  const fetchVillage = useCallback(async () => {
    const res = await axios.get(`/api/wilayah?type=villages&districtId=${form.districtId}`);
    const mapped = res.data.map((vill: { id: string; name: string }) => ({
      value: vill.id,
      label: vill.name,
    })) as { value: string; label: string }[];

    const formattedVillages = mapped.sort((a, b) => a.label.localeCompare(b.label));
    setVillages(formattedVillages);
  }, [form.districtId, setVillages]);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  useEffect(() => {
    if (form.provinceId) fetchRegency();
  }, [form.provinceId, fetchRegency]);

  useEffect(() => {
    if (form.regencyId) fetchDistrict();
  }, [form.regencyId, fetchDistrict]);

  useEffect(() => {
    if (form.districtId) fetchVillage();
  }, [form.districtId, fetchVillage]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);

      const provinceObj = provinces.find((item) => item.value === form.provinceId);
      const regencyObj = regencies.find((item) => item.value === form.regencyId);
      const districtObj = districts.find((item) => item.value === form.districtId);
      const villageObj = villages.find((item) => item.value === form.villageId);

      const payload = {
        label: form.label,
        provinceId: provinceObj?.value,
        province: provinceObj?.label,
        regencyId: regencyObj?.value,
        regency: regencyObj?.label,
        districtId: districtObj?.value,
        district: districtObj?.label,
        villageId: villageObj?.value,
        village: villageObj?.label,
        postalCode: form.postalCode,
        fullAddress: form.fullAddress,
        isDefault: form.isDefault,
      };

      const res = await axiosInstance.post("/user/account/address", payload);
      toast.success(res.data.message);

      setForm(initialForm);
      router.push("/profile/address");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (process.env.NODE_ENV === "development") console.log(error);
        setErrors(error?.response?.data?.errors);
      }
    } finally {
      setPending(false);
    }
  };

  if (pendingProvince) return <Pending />;

  return (
    <div className="bg-card p-3 md:p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2 mb-2">Create Address</h2>
        <form onSubmit={onSubmit}>
          <FormInput
            label="Label"
            id="label"
            placeholder="Rumah / Kantor"
            value={form.label}
            handleChange={(e) => setForm({ ...form, label: e.target.value })}
            error={errors?.label}
          />
          <FormSelect
            label="Province"
            options={provinces}
            placeholder="Select Province"
            value={form.provinceId}
            onChange={(val) => setForm({ ...form, provinceId: val })}
            error={errors?.provinceId}
          />
          <FormSelect
            label="Regency"
            options={regencies}
            placeholder="Select Regency"
            value={form.regencyId}
            onChange={(val) => setForm({ ...form, regencyId: val })}
            error={errors?.regencyId}
          />
          <FormSelect
            label="District"
            options={districts}
            placeholder="Select District"
            value={form.districtId}
            onChange={(val) => setForm({ ...form, districtId: val })}
            error={errors?.districtId}
          />
          <FormSelect
            label="Village"
            options={villages}
            placeholder="Select Village"
            value={form.villageId}
            onChange={(val) => setForm({ ...form, villageId: val })}
            error={errors?.villageId}
          />
          <FormTextarea
            label="Full Address"
            id="fullAddress"
            placeholder="Full Address"
            value={form.fullAddress}
            handleChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
            error={errors?.fullAddress}
          />
          <FormInput
            label="Postal Code"
            id="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            handleChange={(e) => {
              const input = e.target.value;

              if (/[^0-9]/.test(input)) {
                alert("Hanya angka yang diperbolehkan");
                return;
              }

              if (input.length > 5) {
                alert("Kode pos tidak boleh lebih dari 5 digit");
                return;
              }

              setForm({ ...form, postalCode: input });
            }}
            error={errors?.postalCode}
          />
          <div className="mb-3">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            <label htmlFor="isDefault" className="ml-2">
              Set as default address
            </label>
          </div>
          <div>
            <Button type="submit" disabled={pending}>
              {pending ? "Loading..." : "Create Address"}
            </Button>
            <Button variant="secondary" className="ml-2" onClick={() => setForm(initialForm)}>
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
