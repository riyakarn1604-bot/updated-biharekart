import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Bihar Bazaar",
  description: "Bihar Bazaar admin panel — manage orders, products, users, sellers and analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
