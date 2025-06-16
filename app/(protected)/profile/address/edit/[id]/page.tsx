"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import { Button } from "@/components/ui/button";
import { useAddressStore } from "@/lib/addressStore";
import Pending from "@/components/Pending";
import { axiosInstance } from "@/lib/utils";

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

export default function EditAddress() {
  const { id } = useParams();
  const router = useRouter();

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

  const [form, setForm] = useState(initialForm);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]> | null>(null);

  // Fetch address data by ID
  const fetchAddress = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/user/account/address/${id}`);
      const data = res.data;

      setForm({
        label: data.label,
        provinceId: data.provinceId,
        regencyId: data.regencyId,
        districtId: data.districtId,
        villageId: data.villageId,
        postalCode: data.postalCode,
        fullAddress: data.fullAddress,
        isDefault: data.isDefault,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data alamat.");
    }
  }, [id]);

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
    } finally {
      setPendingProvince(false);
    }
  }, [setProvinces, setPendingProvince]);

  const fetchRegency = useCallback(async () => {
    if (!form.provinceId) return;
    const res = await axios.get(`/api/wilayah?type=regencies&provinceId=${form.provinceId}`);
    const mapped = res.data.map((reg: { id: string; name: string }) => ({
      value: reg.id,
      label: reg.name,
    })) as { value: string; label: string }[];

    const formattedRegencies = mapped.sort((a, b) => a.label.localeCompare(b.label));
    setRegencies(formattedRegencies);
  }, [form.provinceId, setRegencies]);

  const fetchDistrict = useCallback(async () => {
    if (!form.regencyId) return;
    const res = await axios.get(`/api/wilayah?type=districts&regencyId=${form.regencyId}`);
    const mapped = res.data.map((dist: { id: string; name: string }) => ({
      value: dist.id,
      label: dist.name,
    })) as { value: string; label: string }[];
    const formattedDistricts = mapped.sort((a, b) => a.label.localeCompare(b.label));
    setDistricts(formattedDistricts);
  }, [form.regencyId, setDistricts]);

  const fetchVillage = useCallback(async () => {
    if (!form.districtId) return;
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
    fetchAddress();
  }, [fetchProvinces, fetchAddress]);

  useEffect(() => {
    fetchRegency();
  }, [form.provinceId, fetchRegency]);

  useEffect(() => {
    fetchDistrict();
  }, [form.regencyId, fetchDistrict]);

  useEffect(() => {
    fetchVillage();
  }, [form.districtId, fetchVillage]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);

      const payload = {
        ...form,
        province: provinces.find((p) => p.value === form.provinceId)?.label,
        regency: regencies.find((r) => r.value === form.regencyId)?.label,
        district: districts.find((d) => d.value === form.districtId)?.label,
        village: villages.find((v) => v.value === form.villageId)?.label,
      };

      const res = await axiosInstance.patch(`/user/account/address/${id}`, payload);
      toast.success(res.data.message);
      router.push("/profile/address");
    } catch (err) {
      toast.error("Gagal mengedit alamat");
      if (err instanceof axios.AxiosError) {
        setErrors(err?.response?.data?.errors);
      }
    } finally {
      setPending(false);
    }
  };

  if (pendingProvince) return <Pending />;

  return (
    <div className="bg-card p-3 md:p-6 rounded-md">
      <div className="mb-3">
        <h2 className="h2 mb-2">Edit Address</h2>
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
            value={form.provinceId}
            onChange={(val) => setForm({ ...form, provinceId: val })}
            error={errors?.provinceId}
          />
          <FormSelect
            label="Regency"
            options={regencies}
            value={form.regencyId}
            onChange={(val) => setForm({ ...form, regencyId: val })}
            error={errors?.regencyId}
          />
          <FormSelect
            label="District"
            options={districts}
            value={form.districtId}
            onChange={(val) => setForm({ ...form, districtId: val })}
            error={errors?.districtId}
          />
          <FormSelect
            label="Village"
            options={villages}
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
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            <label htmlFor="isDefault" className="ml-2">
              Set as default address
            </label>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Updating..." : "Update Address"}
          </Button>
        </form>
      </div>
    </div>
  );
}
