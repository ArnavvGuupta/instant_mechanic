"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  created_at: string;
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
    | "calendar"
    | "arrow"
    | "user";
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

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="17" rx="2" />
          <path d="M16 2.5v4M8 2.5v4M3 9h18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    default:
      return null;
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function loadCustomers() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/customers`);

      if (!response.ok) {
        throw new Error(`Customers API failed: ${response.status}`);
      }

      const data = await response.json();

      setCustomers(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [customers, search]);

  const cities = new Set(
    customers.map((customer) => customer.city).filter(Boolean)
  ).size;

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

        .customer-fade {
          animation: fadeUp 0.5s ease-out both;
        }

        .customer-scale {
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                <Icon name="users" size={21} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>Operations</span>
                  <span>/</span>
                  <span>Customers</span>
                </div>

                <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                  Customers
                </h1>

                <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                  Manage and monitor your customer database.
                </p>
              </div>
            </div>

            <button
              onClick={loadCustomers}
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

          <section className="customer-fade relative mb-7 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 right-52 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Customer management
                </div>

                <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  Your customers, organized.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Search, review and manage customer information from a
                  clean operational workspace.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-800">
                    Database connected
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-600">
                    Customer data is up to date
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* SUMMARY CARDS                                                    */}
          {/* ================================================================ */}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="customer-fade group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/40">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/60 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-500">
                    Total customers
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : customers.length}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Registered accounts
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-110 group-hover:rotate-3">
                  <Icon name="users" size={19} />
                </div>
              </div>
            </div>

            <div className="customer-fade group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/40">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-100/60 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-violet-500">
                    Cities covered
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : cities}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Unique customer locations
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:scale-110 group-hover:rotate-3">
                  <Icon name="map" size={19} />
                </div>
              </div>
            </div>

            <div className="customer-fade group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/40">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl transition group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-500">
                    Visible customers
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {loading ? "—" : filteredCustomers.length}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Matching current search
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-110 group-hover:rotate-3">
                  <Icon name="search" size={19} />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* SEARCH / TOOLBAR                                                 */}
          {/* ================================================================ */}

          <section className="customer-fade mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Customer directory
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  {search
                    ? `${filteredCustomers.length} matching customer${
                        filteredCustomers.length !== 1 ? "s" : ""
                      }`
                    : `${customers.length} customer${
                        customers.length !== 1 ? "s" : ""
                      } in your database`}
                </p>
              </div>

              <div className="relative w-full lg:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Icon name="search" size={16} />
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, phone or city..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-xs font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* LOADING                                                          */}
          {/* ================================================================ */}

          {loading && (
            <div className="customer-scale rounded-[24px] border border-slate-200/80 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <span className="animate-spin">
                  <Icon name="refresh" size={22} />
                </span>
              </div>

              <p className="text-sm font-bold text-slate-800">
                Loading customers
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Fetching the latest customer records...
              </p>
            </div>
          )}

          {/* ================================================================ */}
          {/* ERROR                                                            */}
          {/* ================================================================ */}

          {!loading && error && (
            <div className="customer-scale overflow-hidden rounded-[24px] border border-red-200 bg-white shadow-sm">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  !
                </div>

                <p className="text-sm font-bold text-slate-800">
                  Unable to load customers
                </p>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                  Something went wrong while connecting to the customer
                  service.
                </p>

                <button
                  onClick={loadCustomers}
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
            <section className="customer-fade overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Icon name="users" size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      All customers
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Customer information and contact details
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                  {filteredCustomers.length} records
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Phone
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Location
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className="group cursor-pointer bg-white transition-all duration-200 hover:bg-slate-50"
                        style={{
                          animation: "fadeUp 0.4s ease-out both",
                          animationDelay: `${Math.min(
                            index * 35,
                            500
                          )}ms`,
                        }}
                      >
                        {/* Customer */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-xs font-bold text-slate-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                              {customer.name
                                ?.charAt(0)
                                .toUpperCase() || "?"}

                              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900">
                                {customer.name}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                Customer ID · {customer.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                              <Icon name="mail" size={13} />
                            </span>

                            <span>
                              {customer.email || "No email"}
                            </span>
                          </div>
                        </td>

                        {/* Phone */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                              <Icon name="phone" size={13} />
                            </span>

                            <span>
                              {customer.phone || "No phone"}
                            </span>
                          </div>
                        </td>

                        {/* Location */}

                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                              <Icon name="map" size={13} />
                            </span>

                            <div>
                              <p className="max-w-[220px] truncate text-xs font-semibold text-slate-700">
                                {customer.city || "No city"}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-[10px] text-slate-400">
                                {customer.address || "No address"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Joined */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                              <Icon name="calendar" size={13} />
                            </span>

                            {formatDate(customer.created_at)}
                          </div>
                        </td>

                        {/* Action */}

                        <td className="px-6 py-4 text-right">
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 opacity-70 transition-all group-hover:translate-x-0.5 group-hover:border-slate-300 group-hover:bg-white group-hover:text-slate-700 group-hover:opacity-100">
                            <Icon name="arrow" size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                              <Icon name="search" size={24} />
                            </div>

                            <p className="text-sm font-bold text-slate-700">
                              No customers found
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              Try searching with a different name, email,
                              phone number or city.
                            </p>

                            {search && (
                              <button
                                onClick={() => setSearch("")}
                                className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                              >
                                Clear search
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
            <p>Instant Mechanic · Customer Management</p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Customer database connected
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}