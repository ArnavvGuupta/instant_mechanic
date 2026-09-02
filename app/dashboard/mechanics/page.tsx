"use client";

import { useEffect, useMemo, useState } from "react";

type Mechanic = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  jobs_completed: number;
  current_location: string | null;
  created_at: string;
  updated_at: string;
};

function Icon({
  name,
  size = 18,
}: {
  name:
    | "users"
    | "refresh"
    | "search"
    | "mail"
    | "phone"
    | "map"
    | "briefcase"
    | "check"
    | "clock"
    | "wifi"
    | "arrow";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.8-4L3 10" />
          <path d="M3 5v5h5" />
          <path d="M4 13a8 8 0 0 0 14.8 4L21 14" />
          <path d="M21 19v-5h-5" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
      );

    case "map":
      return (
        <svg {...common}>
          <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
      );

    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "wifi":
      return (
        <svg {...common}>
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M8.5 16.05a6 6 0 0 1 7 0" />
          <path d="M12 19.5h.01" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    default:
      return null;
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      wrapper: string;
      dot: string;
      text: string;
    }
  > = {
    Available: {
      wrapper: "bg-emerald-50 border-emerald-100",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
    },
    Busy: {
      wrapper: "bg-amber-50 border-amber-100",
      dot: "bg-amber-500",
      text: "text-amber-700",
    },
    Offline: {
      wrapper: "bg-slate-100 border-slate-200",
      dot: "bg-slate-400",
      text: "text-slate-600",
    },
  };

  const style = config[status] || {
    wrapper: "bg-blue-50 border-blue-100",
    dot: "bg-blue-500",
    text: "text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold ${style.wrapper} ${style.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot} ${
          status === "Available" ? "animate-pulse" : ""
        }`}
      />

      {status}
    </span>
  );
}

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function loadMechanics() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/mechanics`);

      if (!response.ok) {
        throw new Error(`Mechanics API failed: ${response.status}`);
      }

      const data = await response.json();

      setMechanics(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load mechanics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMechanics();
  }, []);

  const availableCount = mechanics.filter(
    (mechanic) => mechanic.status === "Available"
  ).length;

  const busyCount = mechanics.filter(
    (mechanic) => mechanic.status === "Busy"
  ).length;

  const offlineCount = mechanics.filter(
    (mechanic) => mechanic.status === "Offline"
  ).length;

  const totalJobs = mechanics.reduce(
    (total, mechanic) => total + Number(mechanic.jobs_completed || 0),
    0
  );

  const averageJobs =
    mechanics.length > 0
      ? Math.round(totalJobs / mechanics.length)
      : 0;

  const filteredMechanics = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mechanics.filter((mechanic) => {
      const matchesSearch =
        !query ||
        [
          mechanic.name,
          mechanic.email,
          mechanic.phone,
          mechanic.current_location,
        ]
          .filter(Boolean)
          .some((value) =>
            value!.toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "All" ||
        mechanic.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mechanics, search, statusFilter]);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .mechanic-fade {
          animation: fadeUp 0.5s ease-out both;
        }

        .mechanic-scale {
          animation: scaleIn 0.45s ease-out both;
        }
      `}</style>

      <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-9">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/15">
                <Icon name="briefcase" size={21} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>Operations</span>
                  <span>/</span>
                  <span>Mechanics</span>
                </div>

                <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                  Mechanics
                </h1>

                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                  Monitor your field team and service workload.
                </p>
              </div>
            </div>

            <button
              onClick={loadMechanics}
              disabled={loading}
              className="group flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-slate-950/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }
              >
                <Icon name="refresh" size={14} />
              </span>

              <span className="hidden sm:inline">
                {loading ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* MAIN                                                             */}
        {/* ================================================================ */}

        <main className="mx-auto max-w-[1600px] p-5 sm:p-8 lg:p-9">
          {/* HERO */}

          <section className="mechanic-fade relative mb-7 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 right-52 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Field operations
                </div>

                <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  Your mechanic team, at a glance.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Track availability, workload and location across your
                  service team from one operational workspace.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Icon name="wifi" size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-800">
                    Team monitoring active
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-600">
                    Live mechanic overview
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* KPI CARDS                                                        */}
          {/* ================================================================ */}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total */}

            <div className="mechanic-fade group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Total Mechanics
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : mechanics.length}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Registered team members
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition duration-300 group-hover:scale-110">
                  <Icon name="users" size={19} />
                </div>
              </div>
            </div>

            {/* Available */}

            <div className="mechanic-fade group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/40">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/70 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-600">
                    Available
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : availableCount}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Ready for new jobs
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition duration-300 group-hover:scale-110">
                  <Icon name="check" size={19} />
                </div>
              </div>
            </div>

            {/* Busy */}

            <div className="mechanic-fade group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-100/40">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-100/70 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-600">
                    Currently Busy
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : busyCount}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Working on active jobs
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition duration-300 group-hover:scale-110">
                  <Icon name="clock" size={19} />
                </div>
              </div>
            </div>

            {/* Jobs */}

            <div className="mechanic-fade group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/40">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600">
                    Jobs Completed
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : totalJobs}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    {averageJobs} average per mechanic
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition duration-300 group-hover:scale-110">
                  <Icon name="briefcase" size={19} />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* TOOLBAR                                                          */}
          {/* ================================================================ */}

          <section className="mechanic-fade mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Mechanic directory
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  {filteredMechanics.length} mechanic
                  {filteredMechanics.length !== 1 ? "s" : ""} currently
                  visible
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}

                <div className="relative sm:w-80">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Icon name="search" size={16} />
                  </div>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search mechanic, email, phone..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Status */}

                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {["All", "Available", "Busy", "Offline"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${
                          statusFilter === status
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* LOADING                                                          */}
          {/* ================================================================ */}

          {loading && (
            <div className="mechanic-scale rounded-[24px] border border-slate-200/80 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <span className="animate-spin">
                  <Icon name="refresh" size={22} />
                </span>
              </div>

              <p className="text-sm font-bold text-slate-800">
                Loading mechanics
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Fetching your latest field team data...
              </p>
            </div>
          )}

          {/* ================================================================ */}
          {/* ERROR                                                            */}
          {/* ================================================================ */}

          {!loading && error && (
            <div className="mechanic-scale rounded-[24px] border border-red-200 bg-white shadow-sm">
              <div className="flex flex-col items-center p-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  !
                </div>

                <p className="text-sm font-bold text-slate-800">
                  Unable to load mechanics
                </p>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                  Something went wrong while connecting to the mechanic
                  service.
                </p>

                <button
                  onClick={loadMechanics}
                  className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TABLE                                                            */}
          {/* ================================================================ */}

          {!loading && !error && (
            <section className="mechanic-fade overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
              {/* Table heading */}

              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Icon name="users" size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      All Mechanics
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Team availability and performance overview
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                    {availableCount} available
                  </span>

                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
                    {busyCount} busy
                  </span>
                </div>
              </div>

              {/* Table */}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Mechanic
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Status
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Performance
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Current Location
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredMechanics.map((mechanic, index) => (
                      <tr
                        key={mechanic.id}
                        className="group cursor-pointer bg-white transition-all duration-200 hover:bg-slate-50"
                        style={{
                          animation: "fadeUp 0.4s ease-out both",
                          animationDelay: `${Math.min(
                            index * 40,
                            500
                          )}ms`,
                        }}
                      >
                        {/* Mechanic */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-blue-100 text-sm font-bold text-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                              {mechanic.name
                                ?.charAt(0)
                                .toUpperCase() || "?"}

                              <span
                                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                                  mechanic.status === "Available"
                                    ? "bg-emerald-500"
                                    : mechanic.status === "Busy"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                                }`}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900">
                                {mechanic.name}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                ID · {mechanic.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}

                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                                <Icon name="mail" size={13} />
                              </span>

                              <span className="max-w-[220px] truncate">
                                {mechanic.email || "No email"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                                <Icon name="phone" size={12} />
                              </span>

                              {mechanic.phone || "No phone"}
                            </div>
                          </div>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">
                          <StatusBadge status={mechanic.status} />
                        </td>

                        {/* Performance */}

                        <td className="px-6 py-5">
                          <div className="min-w-[150px]">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-slate-400">
                                Jobs completed
                              </span>

                              <span className="text-xs font-bold text-slate-800">
                                {mechanic.jobs_completed ?? 0}
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                                style={{
                                  width: `${Math.min(
                                    Number(mechanic.jobs_completed || 0) *
                                      5,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Location */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                              <Icon name="map" size={14} />
                            </span>

                            <span className="max-w-[220px] truncate text-xs font-medium text-slate-600">
                              {mechanic.current_location ||
                                "Location unavailable"}
                            </span>
                          </div>
                        </td>

                        {/* Action */}

                        <td className="px-6 py-5 text-right">
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 opacity-70 transition-all group-hover:translate-x-0.5 group-hover:border-slate-300 group-hover:bg-white group-hover:text-slate-700 group-hover:opacity-100">
                            <Icon name="arrow" size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredMechanics.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                              <Icon name="search" size={24} />
                            </div>

                            <p className="text-sm font-bold text-slate-700">
                              No mechanics found
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              Try changing your search or status filter.
                            </p>

                            {(search || statusFilter !== "All") && (
                              <button
                                onClick={() => {
                                  setSearch("");
                                  setStatusFilter("All");
                                }}
                                className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                              >
                                Clear filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* FOOTER */}

          <footer className="flex flex-col items-center justify-between gap-3 py-8 text-[10px] text-slate-400 sm:flex-row">
            <p>Instant Mechanic · Mechanic Operations</p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live team monitoring enabled
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}