"use client";

import { AuthGuard } from "@/components/auth-guard";
import { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import { useAuth } from "@/context/auth-context";
  import { useRouter } from "next/navigation";
  import {
    Star, Car, FileCheck, Clock, DollarSign, MapPin,
    AlertCircle, CheckCircle2, Upload, LogOut, ChevronRight, User
  } from "lucide-react";
  import { Button } from "@/components/ui/button";

  const API = "";
  const EASE = [0.22, 1, 0.36, 1] as const;

  type DocStatus = "pending_documents" | "pending_review" | "approved" | "rejected";

  interface DriverStatus {
    profile: {
      first_name: string | null;
      last_name: string | null;
      rating: number | null;
      total_rides: number | null;
      avatar_url: string | null;
      vehicle: Record<string, string> | null;
    } | null;
    documents: {
      status: DocStatus;
      rejection_reason: string | null;
      license_doc_url: string | null;
      vehicle_registration_url: string | null;
      insurance_doc_url: string | null;
      updated_at: string;
    } | null;
    recent_rides: Array<{
      id: string;
      ride_status: string;
      fare: number;
      pickup_address: string;
      dropoff_address: string;
      created_at: string;
    }>;
    stats: { total_rides: number; rating: number; total_earnings: number };
  }

  const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending_documents: {
      label: "Documents required",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      icon: <Upload className="h-5 w-5 text-amber-600" />,
    },
    pending_review: {
      label: "Under review",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: <Clock className="h-5 w-5 text-blue-600" />,
    },
    approved: {
      label: "Approved — Active driver",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    },
    rejected: {
      label: "Application rejected",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    },
  };

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

  function UploadDocButton({
    label, field, uploaded, token, onDone,
  }: {
    label: string; field: string; uploaded: boolean; token: string | null; onDone: () => void;
  }) {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(uploaded);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !token) return;
      setLoading(true);
      try {
        const sigRes = await fetch(`${API}/api/driver/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ field, filename: file.name, content_type: file.type }),
        });
        const { upload_url } = await sigRes.json() as { upload_url?: string };
        if (!upload_url) throw new Error("No upload URL received");
        await fetch(upload_url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        setDone(true);
        onDone();
      } catch {
        alert("Upload failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <label className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all
        ${done ? "border-emerald-400 bg-emerald-50" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}>
        <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleFile} disabled={loading} />
        <div className={`p-2 rounded-lg shrink-0 ${done ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
          {done ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{loading ? "Uploading…" : done ? "Uploaded" : "Click to upload (JPG, PNG, PDF)"}</p>
        </div>
        {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent shrink-0" />}
      </label>
    );
  }

  function DriverDashboard() {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DriverStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API}/api/driver/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json() as DriverStatus;
        setData(d);
      } catch {
        /* silently ignore */
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => { fetchStatus(); }, [token]);

    const docStatus = (data?.documents?.status ?? "pending_documents") as DocStatus;
    const statusCfg = STATUS_CONFIG[docStatus];
    const name = data?.profile?.first_name ?? user?.name ?? "Driver";

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
                <p className="text-sm font-semibold leading-none">Urbont Driver</p>
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
            <p className="text-muted-foreground mt-1 text-sm">Here's your driver overview</p>
          </motion.div>

          {/* Application status banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.05 }}
            className={`rounded-2xl border p-4 flex items-start gap-3 ${statusCfg.bg}`}
          >
            <div className="mt-0.5">{statusCfg.icon}</div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${statusCfg.color}`}>{statusCfg.label}</p>
              {docStatus === "rejected" && data?.documents?.rejection_reason && (
                <p className="text-xs text-red-600 mt-1">{data.documents.rejection_reason}</p>
              )}
              {docStatus === "pending_documents" && (
                <p className="text-xs text-amber-600 mt-1">Upload your license, vehicle registration, and insurance to complete your application.</p>
              )}
              {docStatus === "pending_review" && (
                <p className="text-xs text-blue-600 mt-1">Our team will review your documents within 1-2 business days.</p>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          {docStatus === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <StatCard icon={<Car className="h-5 w-5" />} label="Total trips" value={String(data?.stats.total_rides ?? 0)} />
              <StatCard icon={<Star className="h-5 w-5" />} label="Rating" value={(data?.stats.rating ?? 5.0).toFixed(1)} />
              <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total earned" value={`$${(data?.stats.total_earnings ?? 0).toLocaleString()}`} />
            </motion.div>
          )}

          {/* Document upload section */}
          {(docStatus === "pending_documents" || docStatus === "rejected") && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.15 }}
              className="rounded-2xl border bg-card p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Required documents</h2>
              </div>
              <div className="space-y-3">
                <UploadDocButton
                  label="Driver's license"
                  field="license_doc_url"
                  uploaded={!!data?.documents?.license_doc_url}
                  token={token}
                  onDone={fetchStatus}
                />
                <UploadDocButton
                  label="Vehicle registration"
                  field="vehicle_registration_url"
                  uploaded={!!data?.documents?.vehicle_registration_url}
                  token={token}
                  onDone={fetchStatus}
                />
                <UploadDocButton
                  label="Insurance certificate"
                  field="insurance_doc_url"
                  uploaded={!!data?.documents?.insurance_doc_url}
                  token={token}
                  onDone={fetchStatus}
                />
              </div>
              {data?.documents?.license_doc_url && data?.documents?.vehicle_registration_url && data?.documents?.insurance_doc_url && (
                <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> All documents uploaded — our team will review them shortly.
                </p>
              )}
            </motion.div>
          )}

          {/* Vehicle info */}
          {data?.profile?.vehicle && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.2 }}
              className="rounded-2xl border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Your vehicle</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {Object.entries(data.profile.vehicle).map(([k, v]) => v && (
                  <div key={k} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent rides */}
          {docStatus === "approved" && data?.recent_rides && data.recent_rides.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.25 }}
              className="rounded-2xl border bg-card p-6"
            >
              <h2 className="font-semibold mb-4">Recent trips</h2>
              <div className="space-y-3">
                {data.recent_rides.map(ride => (
                  <div key={ride.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="p-2 rounded-lg bg-background shrink-0">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ride.pickup_address}</p>
                      <p className="text-xs text-muted-foreground truncate">{ride.dropoff_address}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(ride.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">${ride.fare}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${ride.ride_status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                        {ride.ride_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.3 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Your profile</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{[data?.profile?.first_name, data?.profile?.last_name].filter(Boolean).join(" ") || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{user?.phone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">{user?.id ? new Date().getFullYear() : "—"}</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

export default function Page() {
  return (
    <AuthGuard>
      <DriverDashboard />
    </AuthGuard>
  );
}
