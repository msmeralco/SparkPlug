"use client";

import { useAuth } from "@/providers/authentication";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const UserRequired = ({ children }: { children: React.ReactNode }) => {
  const { user, state, login, register, logout, error, loginWithGoogle } =
    useAuth();

  const router = useRouter();

  useEffect(() => {
    if (state === "unauthenticated") router.push("/login");
    // if (error) alert(error);
  }, [state, user]);

  if (state==="checking" || state === "unauthenticated") return <p></p>;

  return <>{children}</>;
};

export default UserRequired;
