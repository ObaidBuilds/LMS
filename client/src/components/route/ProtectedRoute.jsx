"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, allowedRole }) {
  const router = useRouter();

  useEffect(() => {
    const toekn = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!toekn || !user?.role) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/");
      return;
    }

    if (allowedRole && user.role !== allowedRole) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/");
      return;
    }
  }, [router, allowedRole]);

  return <>{children}</>;
}
