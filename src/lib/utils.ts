import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Room } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function calculateFlooringEstimate(
  selectedRooms: string[],
  rooms: Room[],
  pricePerSqFt: number,
  flatFee = 50
): number {
  const totalSqFt = rooms
    .filter(r => selectedRooms.includes(r.name))
    .reduce((sum, r) => sum + r.sqFt, 0);
  return totalSqFt * pricePerSqFt + flatFee;
}

export function calculateCleaningEstimate(
  selectedRooms: string[],
  rooms: Room[],
  pricePerSqFt: number,
  flatFee = 30
): number {
  const totalSqFt = rooms
    .filter(r => selectedRooms.includes(r.name))
    .reduce((sum, r) => sum + r.sqFt, 0);
  return totalSqFt * pricePerSqFt + flatFee;
}
