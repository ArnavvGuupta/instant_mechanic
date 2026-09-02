"use client";

import { useEffect, useState } from "react";
import {
  Car,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  Fuel,
  UserRound,
  Hash,
  Sparkles,
  Database,
} from "lucide-react";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  fuel_type: string;
  created_at: string;
  customer_name: string | null;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function loadVehicles() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/vehicles`);

      if (!response.ok) {
        throw new Error(`Vehicles API failed: ${response.status}`);
      }

      const data = await response.json();

      setVehicles(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getInitials(name: string | null) {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function getFuelStyle(fuel: string) {
    const value = fuel?.toLowerCase();

    if (value === "petrol") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (value === "diesel") {
      return "bg-slate-100 text-slate-700 border-slate-200";
    }

    if (value === "electric" || value === "ev") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (value === "hybrid") {
      return "bg-violet-50 text-violet-700 border-violet-100";
    }

    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-900">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute right-[-180px] top-[25%] h-[500px] w-[500px] rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-cyan-200/15 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <div className="fade-up">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Operations</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600">Vehicles</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <Car className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Vehicles
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Manage and monitor your registered vehicle fleet.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadVehicles}
            disabled={loading}
            className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-500 ${
                loading
                  ? "animate-spin"
                  : "group-hover:rotate-180"
              }`}
            />

            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] p-5 sm:p-8">
        {/* Summary */}
        <section className="mb-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="fade-up group relative overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-[0_15px_45px_-25px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(37,99,235,0.35)]">
            {/* Decorative blob */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-100/60 blur-2xl transition-all duration-500 group-hover:bg-blue-200/80" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    Total Vehicles
                  </p>

                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                    {vehicles.length}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Database className="h-3.5 w-3.5" />
                    Registered in system
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Car className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <section className="fade-up overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_15px_45px_-25px_rgba(15,23,42,0.2)]">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 px-6 py-6"
                >
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="hidden h-8 w-28 animate-pulse rounded-lg bg-slate-100 sm:block" />

                  <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 md:block" />

                  <div className="hidden h-8 w-20 animate-pulse rounded-full bg-slate-100 lg:block" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="fade-up overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_15px_45px_-25px_rgba(239,68,68,0.25)]">
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Unable to load vehicles
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {error}. Please try refreshing the vehicle records.
              </p>

              <button
                onClick={loadVehicles}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-700 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </section>
        )}

        {/* Main table */}
        {!loading && !error && (
          <section className="fade-up-delay-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_15px_50px_-28px_rgba(15,23,42,0.28)]">
            {/* Table heading */}
            <div className="relative overflow-hidden border-b border-slate-100 px-6 py-6">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <h2 className="text-lg font-black text-slate-950">
                      All Vehicles
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {vehicles.length}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Complete list of registered vehicles and their details.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 sm:self-auto">
                  <Car className="h-3.5 w-3.5" />

                  {vehicles.length === 1
                    ? "1 vehicle"
                    : `${vehicles.length} vehicles`}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-slate-100 bg-slate-50/70">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Registration
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Year
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Fuel Type
                    </th>

                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Added
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((vehicle, index) => (
                    <tr
                      key={vehicle.id}
                      className="group transition-all duration-300 hover:bg-blue-50/30"
                      style={{
                        animationDelay: `${index * 45}ms`,
                      }}
                    >
                      {/* Vehicle */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 transition-all duration-300 group-hover:scale-105 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600">
                            <Car className="h-5 w-5" />

                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                          </div>

                          <div>
                            <div className="font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                              {vehicle.make} {vehicle.model}
                            </div>

                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <CalendarDays className="h-3 w-3" />
                              {vehicle.year || "Year unavailable"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-black text-white shadow-sm">
                            {getInitials(vehicle.customer_name)}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-800">
                              {vehicle.customer_name || "Unknown"}
                            </div>

                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                              <UserRound className="h-3 w-3" />
                              Customer
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Registration */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50">
                          <Hash className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500" />

                          <span className="text-xs font-black tracking-[0.08em] text-slate-700">
                            {vehicle.registration_number ||
                              "NO REGISTRATION"}
                          </span>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-bold text-slate-600">
                          {vehicle.year || "—"}
                        </span>
                      </td>

                      {/* Fuel */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getFuelStyle(
                            vehicle.fuel_type
                          )}`}
                        >
                          <Fuel className="h-3.5 w-3.5" />
                          {vehicle.fuel_type || "Unknown"}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          {formatDate(vehicle.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty */}
                  {vehicles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <Car className="h-8 w-8" />
                        </div>

                        <p className="mt-5 text-lg font-bold text-slate-800">
                          No vehicles found
                        </p>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                          There are currently no registered vehicles to
                          display.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {vehicles.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex flex-col justify-between gap-2 text-xs text-slate-400 sm:flex-row sm:items-center">
                  <span>
                    Showing{" "}
                    <strong className="font-bold text-slate-600">
                      {vehicles.length}
                    </strong>{" "}
                    registered{" "}
                    {vehicles.length === 1 ? "vehicle" : "vehicles"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Vehicle records synced
                  </span>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

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

        @keyframes shimmer {
          0% {
            background-position: -700px 0;
          }

          100% {
            background-position: 700px 0;
          }
        }

        .fade-up {
          animation: fadeUp 0.55s ease-out both;
        }

        .fade-up-delay-1 {
          animation: fadeUp 0.55s ease-out 0.08s both;
        }

        tbody tr {
          animation: fadeUp 0.45s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .fade-up-delay-1,
          tbody tr {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}