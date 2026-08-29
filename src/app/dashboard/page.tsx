"use client";

import { useEffect } from "react";
  import { useRouter } from "next/navigation";
  import { useAuth } from "@/context/auth-context";

  export default function Dashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;
      if (!user) { router.push("/login"); return; }
      if (user.role === "chauffeur" || user.role === "driver") {
        router.push("/driver-dashboard");
      } else {
        router.push("/passenger-dashboard");
      }
    }, [user, isLoading, router]);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }
  