import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchStoreData = async (address: string) => {
  const response = await fetch(`/api/getLocations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
