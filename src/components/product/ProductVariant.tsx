"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ColorKey, Product } from "@/lib/products";

const VariantContext = createContext<{
  color: ColorKey;
  setColor: (color: ColorKey) => void;
} | null>(null);

/** Share colour between the existing gallery and buy box without changing markup. */
export function ProductVariant({ product, children }: { product: Product; children: ReactNode }) {
  const [color, setColor] = useState<ColorKey>(product.colors[0]);
  return <VariantContext.Provider value={{ color, setColor }}>{children}</VariantContext.Provider>;
}

export function useProductVariant() {
  const value = useContext(VariantContext);
  if (!value) throw new Error("ProductVariant provider is required");
  return value;
}
