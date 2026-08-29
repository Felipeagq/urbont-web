"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import { useAuth } from "@/context/auth-context";
  import { useRouter } from "next/navigation";
  import { Star, Car, DollarSign, MapPin, Clock, LogOut, User, ChevronRight } from "lucide-react";
  import { Button } from "@/components/ui/button";

  const API = "";
  const EASE = [0.22, 1, 0.36, 1] as const;

  interface Ride {
    id: string;
    ride_status: string;
    fare: number;
    vehicle_type: string;
    pickup_address: string;
    dropoff_address: string;
    created_at: string;
    payment_method: string;
    driver: { first_name: string | null; last_name: string | null; rating: number | null; avatar_url: string | null } | null;
  }

  interface PassengerData {
    profile: {
      first_name: string | null;
      last_name: string | null;
      email: string | null;
      total_rides: number | null;
      rating: number | null;
      avatar_url: string | null;
    } | null;
    rides: Ride[];
    pagination: { page: number; limit: number; total: number };
    stats: { total_rides: number; total_spent: number; rating: number };
  }

  function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
      <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
        </div>
      </div>
    );
  }

  const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
    completed:   { label: "Completed",   cls: "bg-emerald-100 text-emerald-700" },
    cancelled:   { label: "Cancelled",   cls: "bg-red-100 text-red-700" },
    in_progress: { label: "In progress", cls: "bg-blue-100 text-blue-700" },
    searching:   { label: "Searching",   cls: "bg-amber-100 text-amber-700" },
    confirmed:   { label: "Confirmed",   cls: "bg-primary/10 text-primary" },
  };

  function PassengerDashboard() {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<PassengerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!token) return;
      fetch(`${API}/api/passenger/rides?limit=20`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setData(d as PassengerData))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [token]);

    const name = data?.profile?.first_name ?? user?.name ?? "there";

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg" />
              <div>
                <p className="text-sm font-semibold leading-none">Urbont</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.phone}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push("/"); }} className="gap-1.5 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <h1 className="text-2xl font-bold">Welcome back, {name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">Your ride history and account overview</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <StatCard icon={<Car className="h-5 w-5" />} label="Total trips" value={String(data?.stats.total_rides ?? 0)} />
            <StatCard icon={<Star className="h-5 w-5" />} label="Your rating" value={(data?.stats.rating ?? 5.0).toFixed(1)} />
            <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total spent" value={`$${(data?.stats.total_spent ?? 0).toLocaleString()}`} />
          </motion.div>

          {/* Ride to app CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.1 }}
            className="rounded-2xl border bg-primary text-primary-foreground p-5 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">Book a ride</p>
              <p className="text-sm opacity-80 mt-0.5">Download the Urbont app for the full experience</p>
            </div>
            <a
              href="https://urbont.com"
              className="flex items-center gap-1.5 text-sm font-semibold bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl"
            >
              Get app <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Ride history */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.15 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Ride history</h2>
              {data?.pagination?.total ? (
                <span className="text-xs text-muted-foreground">{data.pagination.total} total</span>
              ) : null}
            </div>

            {!data?.rides?.length ? (
              <div className="py-12 text-center text-muted-foreground">
                <Car className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No rides yet</p>
                <p className="text-xs mt-1">Your trip history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.rides.map(ride => {
                  const badge = STATUS_BADGE[ride.ride_status] ?? { label: ride.ride_status, cls: "bg-muted text-muted-foreground" };
                  return (
                    <div key={ride.id} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="p-2 rounded-lg bg-background shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{ride.pickup_address}</p>
                            <p className="text-xs text-muted-foreground truncate">{ride.dropoff_address}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">${ride.fare}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(ride.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">{ride.vehicle_type}</span>
                          {ride.driver?.first_name && (
                            <span className="text-xs text-muted-foreground">Driver: {ride.driver.first_name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Profile section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.2 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Your profile</h2>
            </div>
            <div className="space-y-0 text-sm">
              {[
                { label: "Name", value: [data?.profile?.first_name, data?.profile?.last_name].filter(Boolean).join(" ") || "—" },
                { label: "Phone", value: user?.phone ?? "—" },
                { label: "Email", value: data?.profile?.email ?? "—" },
                { label: "Role", value: "Passenger" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/conductor")} className="w-full gap-2">
                <Car className="h-4 w-4" /> Become a driver
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

export default function Page() {
  return (
    <AuthGuard>
      <PassengerDashboard />
    </AuthGuard>
  );
}
