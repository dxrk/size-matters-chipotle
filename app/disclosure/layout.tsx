import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Size Matters, Chipotle",
  description: "Rate your portions.",
};

export default function DisclosureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
