"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardStats = {
  customers: number;
  mechanics: number;
  vehicles: number;
  totalBookings: number;
  totalRevenue: number | string;
  averageBookingValue: number | string;
  completionRate: number | string;
};

type RecentBooking = {
  id: string;
  booking_number: string;
  customer_name: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  registration_number: string | null;
  service_name: string | null;
  mechanic_name: string | null;
  status: string;
  amount: number | string;
  scheduled_at: string | null;
  created_at: string;
};

type StatusCount = {
  status: string;
  count: number | string;
};

type DashboardCharts = {
  bookings: {
    month: string;
    bookings: number | string;
  }[];
  revenue: {
    month: string;
    revenue: number | string;
  }[];
  status: StatusCount[];
};

/* -------------------------------------------------------------------------- */
/* ICONS                                                                      */
/* -------------------------------------------------------------------------- */

function Icon({
  name,
  size = 18,
}: {
  name:
    | "home"
    | "calendar"
    | "users"
    | "settings"
    | "chart"
    | "car"
    | "tool"
    | "bell"
    | "arrow"
    | "clock"
    | "check"
    | "wallet"
    | "activity"
    | "menu"
    | "sparkles"
    | "refresh";
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
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="17" rx="2" />
          <path d="M16 2.5v4M8 2.5v4M3 9h18" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.56-1H6.8v-2.4h.24a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.88L8.2 8.66l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.56V5.6h2.4v.2a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1H21v2.4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h17" />
          <path d="m7 15 3-4 3 2 5-7" />
        </svg>
      );

    case "car":
      return (
        <svg {...common}>
          <path d="m5 17-1-5 2-5h12l2 5-1 5" />
          <path d="M4 12h16M7 17h10" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="17" cy="17" r="1.5" />
        </svg>
      );

    case "tool":
      return (
        <svg {...common}>
          <path d="m14.7 6.3 3-3a4 4 0 0 0-5.4 5.4l-7 7a2 2 0 1 0 2.8 2.8l7-7a4 4 0 0 0 5.4-5.4l-3 3-2.8-2.8Z" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "wallet":
      return (
        <svg {...common}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H20v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
          <path d="M4 8h16M16 12h2" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3Z" />
          <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
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

    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed:
      "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
    Pending:
      "bg-amber-50 text-amber-700 ring-amber-200/70",
    Assigned:
      "bg-blue-50 text-blue-700 ring-blue-200/70",
    "On The Way":
      "bg-violet-50 text-violet-700 ring-violet-200/70",
    "In Progress":
      "bg-orange-50 text-orange-700 ring-orange-200/70",
    Cancelled:
      "bg-red-50 text-red-700 ring-red-200/70",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 transition-all duration-200 ${
        styles[status] ||
        "bg-gray-50 text-gray-600 ring-gray-200"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* -------------------------------------------------------------------------- */
/* MAIN DASHBOARD                                                             */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const loadDashboard = async () => {
    try {
      const [statsRes, chartsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/stats`),
        fetch(`${API_URL}/api/dashboard/charts`),
        fetch(`${API_URL}/api/dashboard/recent-bookings`),
      ]);

      if (!statsRes.ok || !chartsRes.ok || !bookingsRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const statsData = await statsRes.json();
      const chartsData = await chartsRes.json();
      const bookingsData = await bookingsRes.json();

      setStats(statsData);
      setCharts(chartsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(loadDashboard, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalStatusBookings =
    charts?.status.reduce(
      (sum, item) => sum + Number(item.count),
      0
    ) || 0;

  const getStatusCount = (status: string) =>
    Number(
      charts?.status.find((item) => item.status === status)?.count
    ) || 0;

  const completedCount = getStatusCount("Completed");
  const pendingCount = getStatusCount("Pending");
  const assignedCount = getStatusCount("Assigned");
  const onTheWayCount = getStatusCount("On The Way");

  const maxBookings = Math.max(
    ...(charts?.bookings.map((item) => Number(item.bookings)) || [1]),
    1
  );

  const navigate = (page: string) => {
    switch (page) {
      case "Dashboard":
        router.push("/dashboard");
        break;
      case "Bookings":
        router.push("/dashboard/bookings");
        break;
      case "Mechanics":
        router.push("/dashboard/mechanics");
        break;
      case "Customers":
        router.push("/dashboard/customers");
        break;
      case "Analytics":
        router.push("/dashboard/stats");
        break;
      case "Vehicles":
        router.push("/dashboard/vehicles");
        break;
      case "Services":
        router.push("/dashboard/services");
        break;
    }
  };

  const statsCards = [
    {
      label: "Customers",
      value: stats?.customers ?? 0,
      icon: "users" as const,
      description: "Registered customers",
      accent: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Mechanics",
      value: stats?.mechanics ?? 0,
      icon: "settings" as const,
      description: "Service professionals",
      accent: "from-violet-500/10 to-purple-500/10",
      iconBg: "bg-violet-50 text-violet-600",
    },
    {
      label: "Vehicles",
      value: stats?.vehicles ?? 0,
      icon: "car" as const,
      description: "Vehicles registered",
      accent: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: "calendar" as const,
      description: "All service requests",
      accent: "from-orange-500/10 to-amber-500/10",
      iconBg: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: "wallet" as const,
      description: "Revenue generated",
      accent: "from-emerald-500/10 to-green-500/10",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Average Booking",
      value: formatCurrency(stats?.averageBookingValue ?? 0),
      icon: "activity" as const,
      description: "Average order value",
      accent: "from-pink-500/10 to-rose-500/10",
      iconBg: "bg-pink-50 text-pink-600",
    },
    {
      label: "Completion Rate",
      value: `${Number(stats?.completionRate ?? 0).toFixed(1)}%`,
      icon: "check" as const,
      description: "Successful services",
      accent: "from-cyan-500/10 to-blue-500/10",
      iconBg: "bg-cyan-50 text-cyan-600",
    },
  ];

  const statusItems = [
    {
      label: "Completed",
      value: completedCount,
      dot: "bg-emerald-500",
      bar: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: pendingCount,
      dot: "bg-amber-500",
      bar: "bg-amber-500",
    },
    {
      label: "On The Way",
      value: onTheWayCount,
      dot: "bg-violet-500",
      bar: "bg-violet-500",
    },
    {
      label: "Assigned",
      value: assignedCount,
      dot: "bg-blue-500",
      bar: "bg-blue-500",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes barGrow {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @keyframes pulseSoft {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }

        .dashboard-fade {
          animation: fadeUp 0.55s ease-out both;
        }

        .dashboard-scale {
          animation: scaleIn 0.5s ease-out both;
        }

        .dashboard-bar {
          animation: barGrow 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .pulse-soft {
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .delay-1 {
          animation-delay: 80ms;
        }

        .delay-2 {
          animation-delay: 160ms;
        }

        .delay-3 {
          animation-delay: 240ms;
        }

        .delay-4 {
          animation-delay: 320ms;
        }

        .delay-5 {
          animation-delay: 400ms;
        }

        .delay-6 {
          animation-delay: 480ms;
        }

        .delay-7 {
          animation-delay: 560ms;
        }
      `}</style>

      <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <div className="flex min-h-screen">
          {/* ================================================================ */}
          {/* SIDEBAR                                                         */}
          {/* ================================================================ */}

          <aside className="hidden w-[270px] shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
            {/* Logo */}

            <div className="flex h-[82px] items-center border-b border-slate-100 px-6">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 opacity-90" />

                  <Icon
                    name="tool"
                    size={21}
                  />
                </div>

                <div>
                  <h1 className="text-[15px] font-bold tracking-tight text-slate-900">
                    Instant Mechanic
                  </h1>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Operations Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}

            <nav className="flex-1 px-4 py-7">
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Overview
              </p>

              {[
                ["Dashboard", "home"],
                ["Bookings", "calendar"],
                ["Mechanics", "settings"],
                ["Customers", "users"],
                ["Analytics", "chart"],
              ].map(([item, icon], index) => (
                <button
                  key={item}
                  onClick={() => navigate(item)}
                  className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all duration-200 ${
                    item === "Dashboard"
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                      : "text-slate-500 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      item === "Dashboard"
                        ? "bg-white/10 text-white"
                        : "bg-slate-50 text-slate-400 group-hover:text-slate-700"
                    }`}
                  >
                    <Icon
                      name={
                        icon as
                          | "home"
                          | "calendar"
                          | "settings"
                          | "users"
                          | "chart"
                      }
                      size={16}
                    />
                  </span>

                  {item}

                  {item === "Dashboard" && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                  )}
                </button>
              ))}

              <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Management
              </p>

              {[
                ["Vehicles", "car"],
                ["Services", "tool"],
              ].map(([item, icon]) => (
                <button
                  key={item}
                  onClick={() => navigate(item)}
                  className="group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-500 transition-all duration-200 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:text-slate-700">
                    <Icon
                      name={icon as "car" | "tool"}
                      size={16}
                    />
                  </span>

                  {item}

                  <span className="ml-auto opacity-0 transition group-hover:opacity-100">
                    <Icon
                      name="arrow"
                      size={14}
                    />
                  </span>
                </button>
              ))}
            </nav>

            {/* User */}

            <div className="border-t border-slate-100 p-4">
              <div className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-slate-200 hover:bg-white hover:shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-950 to-slate-700 text-xs font-bold text-white shadow-sm">
                  AD
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    Admin User
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-slate-400">
                    admin@instantmechanic.com
                  </p>
                </div>

                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          </aside>

          {/* ================================================================ */}
          {/* MAIN                                                             */}
          {/* ================================================================ */}

          <main className="min-w-0 flex-1">
            {/* Header */}

            <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
              <div className="flex items-center gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden">
                  <Icon
                    name="menu"
                    size={19}
                  />
                </button>

                <div>
                  <p className="hidden text-xs font-medium text-slate-400 sm:block">
                    Operations
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="hidden text-slate-300 sm:block">
                      /
                    </span>

                    <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                      Dashboard
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:flex">
                  Today
                  <span className="text-slate-400">⌄</span>
                </button>

                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                  <Icon
                    name="bell"
                    size={17}
                  />

                  <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white shadow-sm">
                  AD
                </div>
              </div>
            </header>

            {/* Content */}

            <div className="mx-auto max-w-[1600px] p-5 sm:p-7 lg:p-9">
              {/* ========================================================== */}
              {/* HERO                                                        */}
              {/* ========================================================== */}

              <section className="dashboard-fade relative mb-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Icon
                          name="sparkles"
                          size={10}
                        />
                      </span>
                      Operations overview
                    </div>

                    <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                      Good morning, Admin
                      <span className="ml-2 inline-block">👋</span>
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      Monitor bookings, mechanics, customers and revenue
                      from one powerful operations workspace.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <span className="pulse-soft absolute h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-emerald-800">
                        System operational
                      </p>

                      <p className="mt-0.5 text-[11px] text-emerald-600">
                        Live data · Auto refresh 30s
                      </p>
                    </div>

                    <button
                      onClick={loadDashboard}
                      className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm transition hover:rotate-180"
                      title="Refresh dashboard"
                    >
                      <Icon
                        name="refresh"
                        size={14}
                      />
                    </button>
                  </div>
                </div>
              </section>

              {/* ========================================================== */}
              {/* STATS                                                       */}
              {/* ========================================================== */}

              <section className="mb-7">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Business overview
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Key performance indicators
                    </p>
                  </div>

                  <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                    Live database values
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {statsCards.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`dashboard-fade group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${stat.accent} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50`}
                      style={{
                        animationDelay: `${index * 70}ms`,
                      }}
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/40 blur-2xl transition group-hover:scale-150" />

                      <div className="relative flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            {stat.label}
                          </p>

                          <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[28px]">
                            {loading ? (
                              <span className="inline-block h-8 w-20 animate-pulse rounded-lg bg-slate-200" />
                            ) : (
                              stat.value
                            )}
                          </p>
                        </div>

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        >
                          <Icon
                            name={stat.icon}
                            size={18}
                          />
                        </div>
                      </div>

                      <div className="relative mt-5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <span className="text-[10px] font-medium text-slate-400">
                          {stat.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ========================================================== */}
              {/* ANALYTICS                                                   */}
              {/* ========================================================== */}

              <section className="grid gap-6 xl:grid-cols-3">
                {/* Bookings Chart */}

                <div className="dashboard-fade rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon
                            name="chart"
                            size={17}
                          />
                        </div>

                        <div>
                          <h2 className="text-sm font-bold text-slate-900">
                            Booking activity
                          </h2>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Monthly booking volume
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        router.push("/dashboard/stats")
                      }
                      className="group flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Analytics
                      <span className="transition group-hover:translate-x-0.5">
                        <Icon
                          name="arrow"
                          size={12}
                        />
                      </span>
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="flex h-64 items-end gap-2 sm:gap-4">
                      {(charts?.bookings || []).map(
                        (item, index) => {
                          const height =
                            (Number(item.bookings) /
                              maxBookings) *
                            100;

                          const month =
                            new Date(
                              item.month
                            ).toLocaleDateString("en-IN", {
                              month: "short",
                            });

                          return (
                            <div
                              key={`${item.month}-${index}`}
                              className="group flex h-full flex-1 flex-col items-center gap-3"
                            >
                              <div className="relative flex h-full w-full items-end">
                                {/* Tooltip */}

                                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                  {item.bookings} bookings
                                </div>

                                <div className="h-full w-full overflow-hidden rounded-t-xl bg-slate-100">
                                  <div
                                    className="dashboard-bar w-full rounded-t-xl bg-gradient-to-t from-slate-950 via-blue-900 to-blue-500 transition-all duration-500 group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-cyan-400"
                                    style={{
                                      height: `${Math.max(
                                        height,
                                        5
                                      )}%`,
                                      animationDelay: `${
                                        index * 80
                                      }ms`,
                                    }}
                                  />
                                </div>
                              </div>

                              <span className="text-[10px] font-medium text-slate-400">
                                {month}
                              </span>
                            </div>
                          );
                        }
                      )}

                      {!loading &&
                        (!charts?.bookings ||
                          charts.bookings.length === 0) && (
                          <div className="flex w-full items-center justify-center text-sm text-slate-400">
                            No booking data available
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Status */}

                <div className="dashboard-fade rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Booking status
                      </h2>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Current distribution
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Icon
                        name="activity"
                        size={17}
                      />
                    </div>
                  </div>

                  <div className="mt-7 flex justify-center">
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 via-white to-violet-50 shadow-inner">
                      <div
                        className="absolute inset-3 rounded-full"
                        style={{
                          background:
                            "conic-gradient(#10b981 0deg, #10b981 130deg, #f59e0b 130deg, #f59e0b 190deg, #8b5cf6 190deg, #8b5cf6 245deg, #3b82f6 245deg, #3b82f6 360deg)",
                        }}
                      />

                      <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                        <p className="text-3xl font-bold tracking-tight text-slate-950">
                          {loading ? "—" : totalStatusBookings}
                        </p>

                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Total
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4">
                    {statusItems.map((item) => {
                      const percentage =
                        totalStatusBookings > 0
                          ? Math.round(
                              (item.value /
                                totalStatusBookings) *
                                100
                            )
                          : 0;

                      return (
                        <div key={item.label}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${item.dot}`}
                              />

                              <span className="text-xs font-medium text-slate-600">
                                {item.label}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-slate-800">
                              {item.value}
                              <span className="ml-1 font-medium text-slate-400">
                                {percentage}%
                              </span>
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${item.bar} transition-all duration-1000`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ========================================================== */}
              {/* QUICK INSIGHT                                               */}
              {/* ========================================================== */}

              <section className="dashboard-fade mt-6 grid gap-4 sm:grid-cols-3">
                <div className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Icon
                        name="calendar"
                        size={17}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">
                        Bookings
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {stats?.totalBookings ?? 0} total requests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Icon
                        name="check"
                        size={17}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-500">
                        Completion
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {Number(
                          stats?.completionRate ?? 0
                        ).toFixed(1)}
                        % success rate
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <Icon
                        name="wallet"
                        size={17}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-500">
                        Revenue
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {formatCurrency(
                          stats?.totalRevenue ?? 0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================== */}
              {/* RECENT BOOKINGS                                             */}
              {/* ========================================================== */}

              <section className="dashboard-fade mt-7 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <Icon
                        name="calendar"
                        size={17}
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Recent bookings
                      </h2>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Latest vehicle service requests
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push("/dashboard/bookings")
                    }
                    className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                  >
                    View all bookings

                    <span className="transition-transform group-hover:translate-x-1">
                      <Icon
                        name="arrow"
                        size={13}
                      />
                    </span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Booking
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Vehicle
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Service
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Mechanic
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Status
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Scheduled
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {bookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-16 text-center"
                          >
                            <div className="mx-auto flex max-w-xs flex-col items-center">
                              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Icon
                                  name="calendar"
                                  size={22}
                                />
                              </div>

                              <p className="text-sm font-semibold text-slate-700">
                                {loading
                                  ? "Loading bookings..."
                                  : "No recent bookings"}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-400">
                                {loading
                                  ? "Fetching the latest operational data."
                                  : "New bookings will appear here automatically."}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking, index) => (
                          <tr
                            key={booking.id}
                            className={`group cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50/[0.25]"
                            }`}
                            onClick={() =>
                              router.push(
                                `/dashboard/bookings/${booking.id}`
                              )
                            }
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600 transition group-hover:bg-slate-950 group-hover:text-white">
                                  #
                                </div>

                                <div>
                                  <p className="text-xs font-bold text-slate-900">
                                    {booking.booking_number}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    Service request
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-[10px] font-bold text-slate-600">
                                  {(
                                    booking.customer_name ||
                                    "C"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span className="text-xs font-semibold text-slate-700">
                                  {booking.customer_name ||
                                    "Unknown customer"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div>
                                <p className="text-xs font-semibold text-slate-700">
                                  {booking.vehicle_make}{" "}
                                  {booking.vehicle_model}
                                </p>

                                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                  {booking.registration_number ||
                                    "No registration"}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-slate-600">
                                {booking.service_name || "—"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-slate-600">
                                {booking.mechanic_name || "Unassigned"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <StatusBadge status={booking.status} />
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-slate-800">
                                {formatCurrency(booking.amount)}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <Icon
                                  name="clock"
                                  size={13}
                                />

                                {formatDateTime(
                                  booking.scheduled_at
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ========================================================== */}
              {/* FOOTER                                                      */}
              {/* ========================================================== */}

              <footer className="flex flex-col items-center justify-between gap-3 py-8 text-[10px] text-slate-400 sm:flex-row">
                <p>
                  © 2026 Instant Mechanic · Operations Platform
                </p>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live monitoring enabled
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}