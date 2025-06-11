import axios, { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const baseURL =
  process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API_PROD;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosInstance = axios.create({ baseURL, withCredentials: true });

export const errMsg = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (process.env.NODE_ENV === "development") console.log(error);
  }
};

export const smartTrim = (text: string, maxLength = 60) => {
  if (text.length <= maxLength) return text;

  const words = text.split(" ");
  let result = "";

  for (const word of words) {
    if ((result + " " + word).trim().length <= maxLength) {
      result = (result + " " + word).trim();
    } else {
      break;
    }
  }

  return result + "...";
};

// function formatTime(datetime) {
//     const date = new Date(datetime);

//     const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
//     const tanggal = date.toLocaleDateString("id-ID", {
//         day: "2-digit",
//         month: "long",
//         year: "numeric",
//     });
//     const jam = date.toLocaleTimeString("id-ID", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//     });

//     return `${hari}, ${tanggal} - Jam ${jam}`;
// }
