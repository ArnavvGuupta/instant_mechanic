"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Wrench,
  Tag,
  Clock,
  IndianRupee,
  LayoutGrid,
  CircleAlert,
  ListFilter,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  CalendarDays,
  X,
} from "lucide-react";

type Service = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  base_price: number;
  estimated_minutes: number;
  created_at: string;
};

const CATEGORY_PALETTE = [
  "bg-blue-50 text-blue-700 ring-blue-600/10",
  "bg-violet-50 text-violet-700 ring-violet-600/10",
  "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  "bg-amber-50 text-amber-800 ring-amber-600/10",
  "bg-rose-50 text-rose-700 ring-rose-600/10",
  "bg-cyan-50 text-cyan-700 ring-cyan-600/10",
  "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/10",
];

function categoryStyle(category: string) {
  const key = category || "General";

  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash =
      (hash * 31 + key.charCodeAt(i)) % CATEGORY_PALETTE.length;
  }

  return CATEGORY_PALETTE[Math.abs(hash)];
}

function formatDuration(minutes: number) {
  if (!minutes) return "—";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-6">
          <div className="h-4 w-full max-w-[8rem] animate-pulse rounded-lg bg-slate-100" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-50" />
        </td>
      ))}
    </tr>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function loadServices(isManualRefresh = false) {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/services`);

      if (!response.ok) {
        throw new Error(`Services API failed: ${response.status}`);
      }

      const data = await response.json();

      setServices(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load services");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          services.map((s) => s.category || "General")
        )
      ).sort(),
    [services]
  );

  const filteredServices = services.filter((service) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      service.name?.toLowerCase().includes(term) ||
      service.category?.toLowerCase().includes(term) ||
      service.description?.toLowerCase().includes(term);

    const matchesCategory =
      categoryFilter === "All" ||
      (service.category || "General") === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters =
    search.trim() !== "" || categoryFilter !== "All";

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce(
            (total, service) =>
              total + Number(service.base_price || 0),
            0
          ) / services.length
        )
      : 0;

  const highestPrice =
    services.length > 0
      ? Math.max(
          ...services.map((service) =>
            Number(service.base_price || 0)
          )
        )
      : 0;

  const averageDuration =
    services.length > 0
      ? Math.round(
          services.reduce(
            (total, service) =>
              total + Number(service.estimated_minutes || 0),
            0
          ) / services.length
        )
      : 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-200/20 blur-3xl" />

        <div className="absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-violet-200/20 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[30%] h-[450px] w-[450px] rounded-full bg-cyan-200/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
        {/* Header */}
        <header className="fade-up mb-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                <span>Operations</span>
                <span className="text-slate-300">/</span>
                <span className="text-blue-600">Services</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-500/20">
                  <Wrench
                    className="h-6 w-6"
                    strokeWidth={2.2}
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Services
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    Manage your vehicle service catalog, pricing and
                    availability.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => loadServices(true)}
              disabled={refreshing}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }`}
              />

              {refreshing ? "Refreshing..." : "Refresh services"}
            </button>
          </div>
        </header>

        {/* KPI cards */}
        {!loading && !error && services.length > 0 && (
          <section className="mb-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<LayoutGrid className="h-5 w-5" />}
              label="Total services"
              value={services.length.toLocaleString("en-IN")}
              description="Available in catalog"
              accent="blue"
              delay="0s"
            />

            <StatCard
              icon={<Tag className="h-5 w-5" />}
              label="Categories"
              value={categories.length.toLocaleString("en-IN")}
              description="Service categories"
              accent="violet"
              delay="0.06s"
            />

            <StatCard
              icon={<IndianRupee className="h-5 w-5" />}
              label="Average price"
              value={`₹${averagePrice.toLocaleString("en-IN")}`}
              description="Across all services"
              accent="emerald"
              delay="0.12s"
            />

            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="Avg. duration"
              value={formatDuration(averageDuration)}
              description={`Highest price ₹${highestPrice.toLocaleString(
                "en-IN"
              )}`}
              accent="amber"
              delay="0.18s"
            />
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="fade-up mb-7 overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_15px_45px_-25px_rgba(239,68,68,0.25)]">
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <CircleAlert className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Couldn't load services
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {error}. Please try again to fetch the latest
                service catalog.
              </p>

              <button
                onClick={() => loadServices()}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-700 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </section>
        )}

        {/* Loading state */}
        {loading && (
          <section className="fade-up overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_15px_45px_-25px_rgba(15,23,42,0.2)]">
            <div className="border-b border-slate-100 px-6 py-6">
              <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-100" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-50" />
            </div>

            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 px-6 py-6"
                >
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-50" />
                  </div>

                  <div className="hidden h-7 w-24 animate-pulse rounded-full bg-slate-100 md:block" />

                  <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 lg:block" />

                  <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 xl:block" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main services */}
        {!loading && !error && (
          <section className="fade-up-delay-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_15px_50px_-28px_rgba(15,23,42,0.28)]">
            {/* Section header */}
            <div className="relative overflow-hidden border-b border-slate-100 px-6 py-6">
              <div className="absolute right-[-30px] top-[-50px] h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

              <div className="relative flex flex-col gap-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Sparkles className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-xl font-black tracking-tight text-slate-950">
                          Service catalog
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {filteredServices.length} of{" "}
                          {services.length} services displayed
                        </p>
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="inline-flex items-center gap-2 self-start rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Filters active
                    </div>
                  )}
                </div>

                {/* Search / Filters */}
                <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_auto]">
                  <div className="group relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-500" />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by service, category or description..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-10 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="All">All categories</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("All");
                    }}
                    disabled={!hasActiveFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ListFilter className="h-4 w-4" />
                    Clear filters
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/70">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Service
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Category
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Description
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Base price
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Duration
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Added
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredServices.map((service, index) => (
                    <tr
                      key={service.id}
                      className="group transition-all duration-300 hover:bg-blue-50/30"
                      style={{
                        animation: "fadeUp 0.45s ease-out both",
                        animationDelay: `${index * 45}ms`,
                      }}
                    >
                      {/* Service */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 transition-all duration-300 group-hover:scale-105 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600">
                            <Wrench className="h-5 w-5" />
                          </div>

                          <div>
                            <div className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                              {service.name}
                            </div>

                            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <ArrowUpRight className="h-3 w-3" />
                              Service offering
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${categoryStyle(
                            service.category
                          )}`}
                        >
                          <Tag className="h-3 w-3" />
                          {service.category || "General"}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="max-w-[340px] px-6 py-5">
                        <div className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {service.description || (
                            <span className="italic text-slate-300">
                              No description available
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">
                          <IndianRupee className="h-3.5 w-3.5" />

                          {Number(
                            service.base_price || 0
                          ).toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                          <Clock className="h-4 w-4 text-blue-500" />

                          {formatDuration(
                            service.estimated_minutes
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          {formatDate(service.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty */}
                  {!loading && filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20">
                        <div className="mx-auto flex max-w-md flex-col items-center text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            {hasActiveFilters ? (
                              <Search className="h-7 w-7" />
                            ) : (
                              <Wrench className="h-7 w-7" />
                            )}
                          </div>

                          <h3 className="mt-5 text-lg font-black text-slate-900">
                            {hasActiveFilters
                              ? "No matching services"
                              : "No services yet"}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {hasActiveFilters
                              ? "Try adjusting your search term or selecting another category."
                              : "Your service catalog is currently empty. Services added to the platform will appear here."}
                          </p>

                          {hasActiveFilters && (
                            <button
                              onClick={() => {
                                setSearch("");
                                setCategoryFilter("All");
                              }}
                              className="mt-6 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-95"
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

            {/* Footer */}
            {services.length > 0 && (
              <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs sm:flex-row sm:items-center">
                <div className="font-medium text-slate-400">
                  Showing{" "}
                  <span className="font-black text-slate-600">
                    {filteredServices.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-slate-600">
                    {services.length}
                  </span>{" "}
                  services
                </div>

                <div className="flex items-center gap-2 font-semibold text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Catalog synced successfully
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Animations */}
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

        .fade-up {
          animation: fadeUp 0.55s ease-out both;
        }

        .fade-up-delay-1 {
          animation: fadeUp 0.55s ease-out 0.08s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .fade-up-delay-1,
          tbody tr {
            animation: none !important;
          }

          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  accent = "blue",
  delay = "0s",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  accent?: "blue" | "violet" | "emerald" | "amber";
  delay?: string;
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      glow: "group-hover:bg-blue-100",
      line: "from-blue-500 to-indigo-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      glow: "group-hover:bg-violet-100",
      line: "from-violet-500 to-fuchsia-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      glow: "group-hover:bg-emerald-100",
      line: "from-emerald-500 to-teal-500",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      glow: "group-hover:bg-amber-100",
      line: "from-amber-400 to-orange-500",
    },
  };

  const style = styles[accent];

  return (
    <div
      className="fade-up group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(37,99,235,0.25)]"
      style={{ animationDelay: delay }}
    >
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-slate-100 blur-2xl transition-all duration-500 ${style.glow}`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
              {label}
            </p>

            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {value}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {description}
            </p>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${style.icon} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            {icon}
          </div>
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full w-2/3 rounded-full bg-gradient-to-r ${style.line} transition-all duration-700 group-hover:w-full`}
          />
        </div>
      </div>
    </div>
  );
}