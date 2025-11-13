"use client";

import UserRequired from "@/components/routeGuards/UserRequired";  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <UserRequired>
    
        {children}
    </UserRequired>
  );
}
