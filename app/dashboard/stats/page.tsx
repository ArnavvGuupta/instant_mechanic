"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

import {
    Users,
    Wrench,
    Car,
    Calendar,
    IndianRupee,
    TrendingUp,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    ArrowUpRight,
    Activity,
    Clock3,
    XCircle,
    ChevronRight,
} from "lucide-react";

type Stats = {
    customers: number;
    mechanics: number;
    vehicles: number;
    bookings: number;
    revenue: number;
    averageBookingValue: number;
    completedBookings: number;
    completionRate: number;
};

type BookingChart = {
    month: string;
    bookings: number;
};

type RevenueChart = {
    month: string;
    revenue: number;
};

type StatusChart = {
    status: string;
    count: number;
};

type ChartData = {
    bookings: BookingChart[];
    revenue: RevenueChart[];
    status: StatusChart[];
};

type RecentBooking = {
    id: string;
    booking_number: string;
    status: string;
    amount: number;
    scheduled_at: string;
    created_at: string;
    customer_name: string | null;
    mechanic_name: string | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
    registration_number: string | null;
};

const STATUS_STYLES: Record<string, string> = {
    Pending:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    Assigned:
        "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    "On The Way":
        "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
    "In Progress":
        "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
    Completed:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    Cancelled:
        "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
};

const STATUS_DOT: Record<string, string> = {
    Pending: "bg-amber-500",
    Assigned: "bg-blue-500",
    "On The Way": "bg-violet-500",
    "In Progress": "bg-orange-500",
    Completed: "bg-emerald-500",
    Cancelled: "bg-red-500",
};

const PIE_COLORS: Record<string, string> = {
    Pending: "#f59e0b",
    Assigned: "#2563eb",
    "On The Way": "#7c3aed",
    "In Progress": "#ea580c",
    Completed: "#059669",
    Cancelled: "#dc2626",
};

function formatCurrency(value: number | string | null | undefined) {
    return `₹${Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

function initials(name: string | null) {
    if (!name) return "?";

    return name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/* -------------------------------------------------------
   STAT CARD
------------------------------------------------------- */

function StatCard({
    label,
    value,
    icon: Icon,
    accent,
    description,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ElementType;
    accent: string;
    description?: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
            {/* Decorative background */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gray-50 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500">
                            {label}
                        </p>

                        <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                            {value}
                        </p>

                        {description && (
                            <p className="mt-2 text-xs text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>

                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <Activity className="h-3.5 w-3.5" />
                    Live database
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------
   CHART CARD
------------------------------------------------------- */

function ChartCard({
    title,
    subtitle,
    icon: Icon,
    children,
}: {
    title: string;
    subtitle: string;
    icon?: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="mb-6 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        {Icon && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                <Icon className="h-4 w-4" />
                            </div>
                        )}

                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                {title}
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>

            {children}
        </div>
    );
}

/* -------------------------------------------------------
   SKELETON
------------------------------------------------------- */

function StatsSkeleton() {
    return (
        <div className="min-h-screen bg-[#f7f8fa] p-5 sm:p-8">
            <div className="mx-auto max-w-[1500px] space-y-8">
                <div className="animate-pulse">
                    <div className="h-8 w-64 rounded-lg bg-gray-200" />
                    <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 animate-pulse rounded-2xl bg-gray-200"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="h-40 animate-pulse rounded-3xl bg-gray-200 lg:col-span-1" />
                    <div className="h-40 animate-pulse rounded-3xl bg-gray-200" />
                    <div className="h-40 animate-pulse rounded-3xl bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="h-[400px] animate-pulse rounded-3xl bg-gray-200" />
                    <div className="h-[400px] animate-pulse rounded-3xl bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [charts, setCharts] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    async function loadDashboard(isManualRefresh = false) {
        try {
            if (isManualRefresh) {
                setRefreshing(true);
            }

            const [
                statsResponse,
                chartsResponse,
                bookingsResponse,
            ] = await Promise.all([
                fetch(`${API_URL}/api/dashboard/stats`),
                fetch(`${API_URL}/api/dashboard/charts`),
                fetch(`${API_URL}/api/dashboard/recent-bookings`),
            ]);

            if (!statsResponse.ok) {
                throw new Error(
                    `Stats API failed: ${statsResponse.status}`
                );
            }

            if (!chartsResponse.ok) {
                throw new Error(
                    `Charts API failed: ${chartsResponse.status}`
                );
            }

            if (!bookingsResponse.ok) {
                throw new Error(
                    `Recent bookings API failed: ${bookingsResponse.status}`
                );
            }

            const statsData = await statsResponse.json();
            const chartsData = await chartsResponse.json();
            const bookingsData = await bookingsResponse.json();

            setRecentBookings(bookingsData);
            setStats(statsData);

            setCharts({
                bookings: chartsData.bookings.map((item: any) => ({
                    month: new Date(item.month).toLocaleDateString(
                        "en-IN",
                        {
                            month: "short",
                            year: "numeric",
                        }
                    ),
                    bookings: Number(item.bookings),
                })),

                revenue: chartsData.revenue.map((item: any) => ({
                    month: new Date(item.month).toLocaleDateString(
                        "en-IN",
                        {
                            month: "short",
                            year: "numeric",
                        }
                    ),
                    revenue: Number(item.revenue),
                })),

                status: chartsData.status.map((item: any) => ({
                    status: item.status,
                    count: Number(item.count),
                })),
            });

            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load dashboard statistics");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadDashboard();

        const interval = setInterval(
            () => loadDashboard(),
            30000
        );

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <StatsSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f7f8fa] p-6">
                <div className="mx-auto flex min-h-[70vh] max-w-[700px] items-center justify-center">
                    <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                            <AlertCircle className="h-7 w-7 text-red-500" />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            Something went wrong
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {error}
                        </p>

                        <button
                            onClick={() => loadDashboard()}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-gray-800"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalStatusCount =
        charts?.status?.reduce(
            (total, item) => total + item.count,
            0
        ) || 0;

    const completedCount =
        charts?.status?.find(
            (s) => s.status === "Completed"
        )?.count ?? 0;

    const cancelledCount =
        charts?.status?.find(
            (s) => s.status === "Cancelled"
        )?.count ?? 0;

    const pendingCount =
        charts?.status?.find(
            (s) => s.status === "Pending"
        )?.count ?? 0;

    const completionPercentage =
        totalStatusCount > 0
            ? ((completedCount / totalStatusCount) * 100).toFixed(1)
            : "0.0";

    return (
        <div className="min-h-screen bg-[#f7f8fa] text-gray-900">
            <div className="mx-auto max-w-[1500px] space-y-8 p-5 sm:p-8">

                {/* =====================================================
                    HERO HEADER
                ====================================================== */}

                <section className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-8 text-white shadow-2xl sm:px-8">
                    {/* Decorative blobs */}
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                    LIVE SYSTEM
                                </span>

                                <span className="text-xs text-gray-500">
                                    Auto-refresh every 30s
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Analytics Overview
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                                Monitor bookings, revenue, customer activity
                                and operational performance from one place.
                            </p>
                        </div>

                        <button
                            onClick={() => loadDashboard(true)}
                            disabled={refreshing}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 transition-transform ${
                                    refreshing
                                        ? "animate-spin"
                                        : "group-hover:rotate-180"
                                }`}
                            />

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh Data"}
                        </button>
                    </div>
                </section>

                {/* =====================================================
                    PRIMARY KPI CARDS
                ====================================================== */}

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Platform Overview
                            </h2>

                            <p className="text-sm text-gray-500">
                                Key operational metrics
                            </p>
                        </div>

                        <Activity className="hidden h-5 w-5 text-gray-300 sm:block" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Customers"
                            value={stats?.customers ?? 0}
                            icon={Users}
                            accent="bg-blue-50 text-blue-600"
                            description="Registered customers"
                        />

                        <StatCard
                            label="Mechanics"
                            value={stats?.mechanics ?? 0}
                            icon={Wrench}
                            accent="bg-emerald-50 text-emerald-600"
                            description="Service professionals"
                        />

                        <StatCard
                            label="Vehicles"
                            value={stats?.vehicles ?? 0}
                            icon={Car}
                            accent="bg-purple-50 text-purple-600"
                            description="Vehicles registered"
                        />

                        <StatCard
                            label="Bookings"
                            value={stats?.bookings ?? 0}
                            icon={Calendar}
                            accent="bg-orange-50 text-orange-600"
                            description="Total service requests"
                        />
                    </div>
                </section>

                {/* =====================================================
                    FINANCIAL / PERFORMANCE CARDS
                ====================================================== */}

                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* Revenue */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 p-6 text-white shadow-xl shadow-emerald-600/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" />

                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-100">
                                        Total Revenue
                                    </p>

                                    <p className="mt-4 text-4xl font-bold tracking-tight">
                                        {formatCurrency(stats?.revenue)}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                    <IndianRupee className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-7 flex items-center gap-2 text-xs text-emerald-100">
                                <TrendingUp className="h-4 w-4" />
                                Revenue generated from completed services
                            </div>
                        </div>
                    </div>

                    {/* Average */}
                    <StatCard
                        label="Average Booking Value"
                        value={formatCurrency(
                            stats?.averageBookingValue
                        )}
                        icon={TrendingUp}
                        accent="bg-indigo-50 text-indigo-600"
                        description="Average value per booking"
                    />

                    {/* Completion */}
                    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Completion Rate
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                                    {Number(
                                        stats?.completionRate ?? 0
                                    ).toFixed(1)}
                                    %
                                </p>

                                <p className="mt-2 text-xs text-gray-500">
                                    {stats?.completedBookings ?? 0} completed
                                    bookings
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-transform duration-300 group-hover:scale-110">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="mb-2 flex justify-between text-xs">
                                <span className="text-gray-400">
                                    Performance
                                </span>

                                <span className="font-semibold text-teal-600">
                                    {Number(
                                        stats?.completionRate ?? 0
                                    ).toFixed(1)}
                                    %
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-1000"
                                    style={{
                                        width: `${Math.min(
                                            Number(
                                                stats?.completionRate ?? 0
                                            ),
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    CHARTS
                ====================================================== */}

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Booking Trend */}
                    <ChartCard
                        title="Booking Trend"
                        subtitle="Monthly booking activity"
                        icon={Calendar}
                    >
                        <div className="h-[330px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={charts?.bookings ?? []}
                                >
                                    <defs>
                                        <linearGradient
                                            id="bookingGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#2563eb"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#2563eb"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        stroke="#eef2f7"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tick={{
                                            fontSize: 12,
                                            fill: "#64748b",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: "#64748b",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        cursor={{
                                            stroke: "#cbd5e1",
                                            strokeDasharray: "4 4",
                                        }}
                                        contentStyle={{
                                            borderRadius: 16,
                                            border: "1px solid #e2e8f0",
                                            boxShadow:
                                                "0 15px 35px rgba(15,23,42,.10)",
                                            fontSize: 13,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                            fill: "#2563eb",
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                        }}
                                        activeDot={{
                                            r: 7,
                                            strokeWidth: 3,
                                            stroke: "#fff",
                                        }}
                                        animationDuration={1200}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Revenue Trend */}
                    <ChartCard
                        title="Revenue Trend"
                        subtitle="Monthly completed-booking revenue"
                        icon={IndianRupee}
                    >
                        <div className="h-[330px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={charts?.revenue ?? []}
                                >
                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        stroke="#eef2f7"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tick={{
                                            fontSize: 12,
                                            fill: "#64748b",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tickFormatter={(value) =>
                                            `₹${Number(
                                                value
                                            ).toLocaleString("en-IN")}`
                                        }
                                        width={90}
                                        tick={{
                                            fontSize: 12,
                                            fill: "#64748b",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(Number(value))
                                        }
                                        cursor={{
                                            stroke: "#cbd5e1",
                                            strokeDasharray: "4 4",
                                        }}
                                        contentStyle={{
                                            borderRadius: 16,
                                            border: "1px solid #e2e8f0",
                                            boxShadow:
                                                "0 15px 35px rgba(15,23,42,.10)",
                                            fontSize: 13,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#059669"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                            fill: "#059669",
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                        }}
                                        activeDot={{
                                            r: 7,
                                            strokeWidth: 3,
                                            stroke: "#fff",
                                        }}
                                        animationDuration={1400}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Status */}
                    <ChartCard
                        title="Booking Status"
                        subtitle="Current booking distribution"
                        icon={Activity}
                    >
                        <div className="h-[300px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={charts?.status ?? []}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={68}
                                        outerRadius={105}
                                        paddingAngle={3}
                                        animationDuration={1000}
                                    >
                                        {(charts?.status ?? []).map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        PIE_COLORS[
                                                            entry.status
                                                        ] ||
                                                        "#6b7280"
                                                    }
                                                    stroke="#fff"
                                                    strokeWidth={3}
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 16,
                                            border:
                                                "1px solid #e2e8f0",
                                            boxShadow:
                                                "0 15px 35px rgba(15,23,42,.10)",
                                            fontSize: 13,
                                        }}
                                    />

                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{
                                            fontSize: 12,
                                            paddingTop: 10,
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-5">
                            <div className="text-center">
                                <p className="text-xl font-bold text-emerald-600">
                                    {completedCount}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Completed
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-xl font-bold text-red-600">
                                    {cancelledCount}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Cancelled
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-xl font-bold text-gray-900">
                                    {completionPercentage}%
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Completion
                                </p>
                            </div>
                        </div>
                    </ChartCard>

                    {/* Operational Snapshot */}
                    <ChartCard
                        title="Operational Snapshot"
                        subtitle="Current workload overview"
                        icon={Activity}
                    >
                        <div className="space-y-5">

                            {/* Pending */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                            <Clock3 className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Pending
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Waiting for action
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-2xl font-bold text-gray-900">
                                        {pendingCount}
                                    </span>
                                </div>
                            </div>

                            {/* Completed */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Completed
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Successfully delivered
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-2xl font-bold text-gray-900">
                                        {completedCount}
                                    </span>
                                </div>
                            </div>

                            {/* Cancelled */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                            <XCircle className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Cancelled
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Cancelled service requests
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-2xl font-bold text-gray-900">
                                        {cancelledCount}
                                    </span>
                                </div>
                            </div>

                            {/* Completion bar */}
                            <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Overall Performance
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Completed bookings
                                        </p>
                                    </div>

                                    <span className="text-2xl font-bold">
                                        {completionPercentage}%
                                    </span>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-1000"
                                        style={{
                                            width: `${Math.min(
                                                Number(
                                                    completionPercentage
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </ChartCard>
                </section>

                {/* =====================================================
                    RECENT BOOKINGS
                ====================================================== */}

                <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">

                    {/* Header */}
                    <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Calendar className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Recent Bookings
                                    </h2>

                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Latest service activity
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href="/dashboard/bookings"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-all hover:-translate-y-0.5 hover:bg-gray-800"
                        >
                            View All

                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Booking
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Vehicle
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Mechanic
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Scheduled
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        Amount
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {recentBookings.map(
                                    (booking, index) => (
                                        <tr
                                            key={booking.id}
                                            style={{
                                                animationDelay: `${index * 70}ms`,
                                            }}
                                            className="group animate-[fadeUp_.45s_ease-out_both] transition-colors hover:bg-blue-50/30"
                                        >
                                            {/* Booking */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">
                                                        {
                                                            booking.booking_number
                                                        }
                                                    </span>

                                                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
                                                </div>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    ID:{" "}
                                                    {booking.id.slice(
                                                        0,
                                                        8
                                                    )}
                                                </p>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                                                        {initials(
                                                            booking.customer_name
                                                        )}
                                                    </div>

                                                    <span className="font-semibold text-gray-900">
                                                        {booking.customer_name ||
                                                            "Unknown"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Vehicle */}
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-gray-900">
                                                    {booking.vehicle_make ||
                                                        "Unknown"}{" "}
                                                    {booking.vehicle_model ||
                                                        ""}
                                                </div>

                                                <div className="mt-1 inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                                                    {booking.registration_number ||
                                                        "No registration"}
                                                </div>
                                            </td>

                                            {/* Mechanic */}
                                            <td className="px-6 py-5">
                                                {booking.mechanic_name ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                                        <span className="font-medium text-gray-700">
                                                            {
                                                                booking.mechanic_name
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>

                                            {/* Scheduled */}
                                            <td className="px-6 py-5">
                                                {booking.scheduled_at ? (
                                                    <>
                                                        <div className="font-medium text-gray-900">
                                                            {new Date(
                                                                booking.scheduled_at
                                                            ).toLocaleDateString(
                                                                "en-IN"
                                                            )}
                                                        </div>

                                                        <div className="mt-1 text-xs text-gray-400">
                                                            {new Date(
                                                                booking.scheduled_at
                                                            ).toLocaleTimeString(
                                                                "en-IN",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Not scheduled
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-transform group-hover:scale-105 ${
                                                        STATUS_STYLES[
                                                            booking.status
                                                        ] ||
                                                        "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            STATUS_DOT[
                                                                booking.status
                                                            ] ||
                                                            "bg-gray-400"
                                                        }`}
                                                    />

                                                    {booking.status}
                                                </span>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-6 py-5 text-right">
                                                <span className="font-bold text-gray-900">
                                                    {formatCurrency(
                                                        booking.amount
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}

                                {recentBookings.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-20 text-center"
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                                                <Calendar className="h-6 w-6 text-gray-400" />
                                            </div>

                                            <p className="mt-4 text-sm font-semibold text-gray-700">
                                                No recent bookings
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                New service requests will appear
                                                here.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Footer */}
                <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-200 py-6 text-xs text-gray-400 sm:flex-row">
                    <span>
                        Instant Mechanic · Analytics Dashboard
                    </span>

                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        System operational
                    </span>
                </div>
            </div>

            {/* =====================================================
                CUSTOM ANIMATIONS
            ====================================================== */}

            <style jsx global>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}