"use client";

import UserRequired from "@/components/routeGuards/UserRequired";
import DashboardNavbar from "./components/DashboardNavbar";
import { useGetHeaderHeight } from "@/hooks/useGetHeaderHeight";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerHeightValue = useGetHeaderHeight();
  return (
    <UserRequired>
      <DashboardNavbar />
      <main
        style={{
          marginTop: headerHeightValue,
          minHeight: `calc(100vh - ${headerHeightValue})`,
        }}
      >
        {children}
      </main>
    </UserRequired>
  );
}
