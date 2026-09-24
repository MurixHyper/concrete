import type { ColorKey, Size } from "./products";

export type Order = {
  id: string;
  date: string; // ISO
  email: string;
  name: string;
  city: string;
  method: "standard" | "express";
  payment: string;
  lines: { slug: string; name: string; color: ColorKey; size: Size; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

const KEY = "concrete-orders-v1";

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  try {
    localStorage.setItem(KEY, JSON.stringify([order, ...loadOrders()].slice(0, 20)));
  } catch {
    /* storage optional */
  }
}

export function newOrderId() {
  return `CN-${Math.floor(100000 + Math.random() * 900000)}`;
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
