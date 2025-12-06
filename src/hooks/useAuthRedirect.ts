"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  role: string;
  name: string;
};

type UseAuthRedirectOptions = {
  allowedRoles?: string[];
  fallback?: string;
  publicPage?: boolean;
};

export function useAuthRedirect({
  allowedRoles,
  fallback,
  publicPage = false,
}: UseAuthRedirectOptions = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    let mounted = true; // para evitar setState si ya no existe componente

    const checkUser = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users/me`, {
          credentials: "include",
        });

        if (!mounted) return;

        if (!res.ok) {
          if (!publicPage) router.replace("/login");
          return setLoading(false);
        }

        const data: User = await res.json();
        setUser(data);

        if (!publicPage && allowedRoles && !allowedRoles.includes(data.role)) {
          if (fallback) return router.replace(fallback);
          if (data.role === "ADMIN") return router.replace("/assignTicket");
          if (data.role === "AGENT") return router.replace("/agent");
          return router.replace("/dashboard");
        }
      } catch (err) {
        if (!publicPage) router.replace("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkUser();

    return () => { mounted = false; };
  }, [router, allowedRoles, fallback, publicPage, backendUrl]);

  return { user, loading };
}
