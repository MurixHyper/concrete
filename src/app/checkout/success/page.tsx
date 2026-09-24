import type { Metadata } from "next";
import { SuccessView } from "@/components/checkout/SuccessView";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default async function SuccessPage(props: PageProps<"/checkout/success">) {
  const { order } = await props.searchParams;
  return <SuccessView orderId={typeof order === "string" ? order : null} />;
}
