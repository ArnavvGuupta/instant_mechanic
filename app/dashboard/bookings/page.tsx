"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  booking_number: string;
  status: string;
  amount: number | string;
  scheduled_at: string | null;
  created_at: string;
  customer_name: string | null;
  mechanic_name: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  registration_number: string | null;
  service_name: string | null;
};

type Customer = {
  id: string;
  name: string;
};

type Vehicle = {
  id: string;
  make: string;
  model: string;
  registration_number: string;
  customer_name: string | null;
  customer_id: string;
};

type Service = {
  id: string;
  name: string;
  base_price: number;
};

type Mechanic = {
  id: string;
  name: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function loadBookings() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/bookings`);

      if (!response.ok) {
        throw new Error(`Bookings API failed: ${response.status}`);
      }

      const data = await response.json();

      setBookings(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function loadFormData() {
    try {
      const [
        customersResponse,
        vehiclesResponse,
        servicesResponse,
        mechanicsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/customers`),
        fetch(`${API_URL}/api/vehicles`),
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/mechanics`),
      ]);

      if (
        !customersResponse.ok ||
        !vehiclesResponse.ok ||
        !servicesResponse.ok ||
        !mechanicsResponse.ok
      ) {
        throw new Error("Failed to load booking form data");
      }

      const [
        customersData,
        vehiclesData,
        servicesData,
        mechanicsData,
      ] = await Promise.all([
        customersResponse.json(),
        vehiclesResponse.json(),
        servicesResponse.json(),
        mechanicsResponse.json(),
      ]);

      setCustomers(customersData);
      setVehicles(vehiclesData);
      setServices(servicesData);
      setMechanics(mechanicsData);
    } catch (err) {
      console.error(err);
      setFormError("Unable to load booking form data");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFilter, itemsPerPage]);

  function openNewBookingForm() {
    setFormError("");
    setFormSuccess("");
    setShowForm(true);

    if (
      customers.length === 0 ||
      vehicles.length === 0 ||
      services.length === 0 ||
      mechanics.length === 0
    ) {
      loadFormData();
    }
  }

  function closeNewBookingForm() {
    if (creating) return;

    setShowForm(false);
    setFormError("");
    setFormSuccess("");

    setCustomerId("");
    setVehicleId("");
    setServiceId("");
    setMechanicId("");
    setScheduledAt("");
    setNotes("");
  }

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();

    setCreating(true);
    setFormError("");
    setFormSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          vehicle_id: vehicleId,
          service_id: serviceId,
          mechanic_id: mechanicId,
          scheduled_at: scheduledAt,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setFormSuccess("Booking created successfully.");

      await loadBookings();

      setTimeout(() => {
        closeNewBookingForm();
      }, 800);
    } catch (err) {
      console.error(err);

      setFormError(
        err instanceof Error ? err.message : "Failed to create booking"
      );
    } finally {
      setCreating(false);
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "Completed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      case "In Progress":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Assigned":
        return "border-violet-200 bg-violet-50 text-violet-700";

      case "On The Way":
        return "border-cyan-200 bg-cyan-50 text-cyan-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  }

  function getStatusDot(status: string) {
    switch (status) {
      case "Completed":
        return "bg-emerald-500";

      case "Pending":
        return "bg-amber-500";

      case "Cancelled":
        return "bg-red-500";

      case "In Progress":
        return "bg-blue-500";

      case "Assigned":
        return "bg-violet-500";

      case "On The Way":
        return "bg-cyan-500";

      default:
        return "bg-gray-400";
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      !searchTerm ||
      booking.booking_number?.toLowerCase().includes(searchTerm) ||
      booking.customer_name?.toLowerCase().includes(searchTerm) ||
      booking.vehicle_make?.toLowerCase().includes(searchTerm) ||
      booking.vehicle_model?.toLowerCase().includes(searchTerm) ||
      booking.registration_number?.toLowerCase().includes(searchTerm) ||
      booking.service_name?.toLowerCase().includes(searchTerm) ||
      booking.mechanic_name?.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    let matchesDate = true;

    if (booking.scheduled_at && dateFilter !== "All") {
      const bookingDate = new Date(booking.scheduled_at);
      const now = new Date();

      if (dateFilter === "Today") {
        matchesDate =
          bookingDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        matchesDate = bookingDate >= sevenDaysAgo;
      }

      if (dateFilter === "Last 30 Days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        matchesDate = bookingDate >= thirtyDaysAgo;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(
    filteredBookings.length / itemsPerPage
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const inProgressCount = bookings.filter(
    (booking) => booking.status === "In Progress"
  ).length;

  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-gray-900">
      <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ========================================================= */}
        {/* HERO HEADER */}
        {/* ========================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-7 text-white shadow-2xl shadow-slate-900/10 sm:px-8">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-cyan-400/5 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div className="animate-[fadeIn_.5s_ease-out]">

              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>Operations</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300">Bookings</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bookings
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Manage service appointments, customers, mechanics and
                booking workflows from one place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  System Active
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                  {bookings.length} total bookings
                </div>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={loadBookings}
                disabled={loading}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : "transition-transform group-hover:rotate-180"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
                </svg>

                Refresh
              </button>

              <button
                onClick={openNewBookingForm}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
              >
                <span className="text-lg leading-none transition-transform group-hover:rotate-90">
                  +
                </span>
                New Booking
              </button>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* STAT CARDS */}
        {/* ========================================================= */}

        {!loading && !error && (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-100 opacity-60 blur-2xl transition-all duration-500 group-hover:scale-150" />

              <div className="relative flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Bookings
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {bookings.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    All service bookings
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M8 3v4M16 3v4M4 10h16" />
                  </svg>
                </div>

              </div>
            </div>

            {/* Pending */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-100 opacity-60 blur-2xl transition-all duration-500 group-hover:scale-150" />

              <div className="relative flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {pendingCount}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Awaiting action
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4l2.5 2" />
                  </svg>
                </div>

              </div>
            </div>

            {/* Progress */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-100 opacity-60 blur-2xl transition-all duration-500 group-hover:scale-150" />

              <div className="relative flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {inProgressCount}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Currently being serviced
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3v18M3 12h18" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                </div>

              </div>
            </div>

            {/* Revenue */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100 opacity-60 blur-2xl transition-all duration-500 group-hover:scale-150" />

              <div className="relative flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Booking Value
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Combined booking amount
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                  <span className="text-lg font-bold">₹</span>
                </div>

              </div>
            </div>

          </section>
        )}

        {/* ========================================================= */}
        {/* NEW BOOKING FORM */}
        {/* ========================================================= */}

        {showForm && (
          <section className="animate-[slideDown_.35s_ease-out] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 px-6 py-6">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    New Booking
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-950">
                    Create New Booking
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Schedule a service appointment in a few simple steps.
                  </p>
                </div>

                <button
                  onClick={closeNewBookingForm}
                  disabled={creating}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  ×
                </button>

              </div>

            </div>

            <div className="p-6">

              {formError && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <span className="font-bold">!</span>
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    ✓
                  </span>
                  {formSuccess}
                </div>
              )}

              <form
                onSubmit={createBooking}
                className="grid gap-5 md:grid-cols-2"
              >

                {/* Customer */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer
                  </label>

                  <select
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value);
                      setVehicleId("");
                    }}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select customer</option>

                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Vehicle
                  </label>

                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">
                      {customerId
                        ? "Select vehicle"
                        : "Select customer first"}
                    </option>

                    {vehicles
                      .filter(
                        (vehicle) =>
                          String(vehicle.customer_id)
                            .trim()
                            .toLowerCase() ===
                          String(customerId)
                            .trim()
                            .toLowerCase()
                      )
                      .map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} —{" "}
                          {vehicle.registration_number}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Service */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Service
                  </label>

                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select service</option>

                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} — ₹
                        {Number(service.base_price).toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mechanic */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mechanic
                  </label>

                  <select
                    value={mechanicId}
                    onChange={(e) => setMechanicId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select mechanic</option>

                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Scheduled Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notes
                  </label>

                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 md:col-span-2">

                  <button
                    type="button"
                    onClick={closeNewBookingForm}
                    disabled={creating}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    )}

                    {creating ? "Creating..." : "Create Booking"}
                  </button>

                </div>

              </form>

            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* LOADING */}
        {/* ========================================================= */}

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-900" />

            </div>

            <p className="font-bold text-slate-800">
              Loading bookings
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Fetching the latest booking information...
            </p>

          </div>
        )}

        {/* ========================================================= */}
        {/* ERROR */}
        {/* ========================================================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 font-bold text-red-600">
                !
              </div>

              <div>
                <p className="font-bold text-red-800">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* BOOKINGS */}
        {/* ========================================================= */}

        {!loading && !error && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Filter Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-6">

              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <div>
                  <div className="flex items-center gap-3">

                    <h2 className="text-lg font-bold tracking-tight text-slate-950">
                      All Bookings
                    </h2>

                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                      {filteredBookings.length}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Search, filter and manage your service bookings.
                  </p>
                </div>

                {(search || statusFilter !== "All" || dateFilter !== "All") && (
                  <div className="animate-[fadeIn_.25s_ease-out] rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                    Filters active
                  </div>
                )}

              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* Search */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Search
                  </label>

                  <div className="relative">

                    <svg
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Booking, customer, vehicle..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                    />

                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="On The Way">On The Way</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Date
                  </label>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>

                {/* Clear */}
                <div className="flex items-end">

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setDateFilter("All");
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98]"
                  >
                    Clear Filters
                  </button>

                </div>

              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] text-sm">

                <thead className="border-b border-slate-100 bg-slate-50/70">

                  <tr>

                    {[
                      "Booking",
                      "Customer",
                      "Vehicle",
                      "Service",
                      "Mechanic",
                      "Scheduled",
                      "Status",
                      "Amount",
                    ].map((heading, index) => (
                      <th
                        key={heading}
                        className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${
                          index === 7 ? "text-right" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedBookings.map((booking, index) => (

                    <tr
                      key={booking.id}
                      className="group animate-[fadeIn_.35s_ease-out] transition-all duration-200 hover:bg-slate-50"
                      style={{
                        animationDelay: `${index * 30}ms`,
                      }}
                    >

                      {/* Booking */}
                      <td className="px-6 py-5">

                        <a
                          href={`/dashboard/bookings/${booking.id}`}
                          className="inline-flex items-center gap-2 font-bold text-slate-900 transition-colors hover:text-blue-600"
                        >
                          {booking.booking_number}

                          <svg
                            className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </a>

                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600">
                            {(booking.customer_name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {booking.customer_name || "Unknown"}
                          </span>

                        </div>

                      </td>

                      {/* Vehicle */}
                      <td className="px-6 py-5">

                        <div className="font-semibold text-slate-800">
                          {booking.vehicle_make || ""}{" "}
                          {booking.vehicle_model || ""}
                        </div>

                        <div className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold tracking-wide text-slate-500">
                          {booking.registration_number ||
                            "No registration"}
                        </div>

                      </td>

                      {/* Service */}
                      <td className="px-6 py-5">

                        <span className="font-medium text-slate-700">
                          {booking.service_name || "Unknown"}
                        </span>

                      </td>

                      {/* Mechanic */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-600">
                            {(booking.mechanic_name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="font-medium text-slate-700">
                            {booking.mechanic_name || "Unassigned"}
                          </span>

                        </div>

                      </td>

                      {/* Scheduled */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-slate-600">

                          <svg
                            className="h-4 w-4 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="17"
                              rx="2"
                            />
                            <path d="M8 2v4M16 2v4M3 10h18" />
                          </svg>

                          <span className="text-xs font-medium">
                            {formatDate(booking.scheduled_at)}
                          </span>

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <div className="relative inline-block">

                          <select
                            value={booking.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;

                              try {
                                const response = await fetch(
                                  `${API_URL}/api/bookings/${booking.id}/status`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      status: newStatus,
                                    }),
                                  }
                                );

                                const data = await response.json();

                                if (!response.ok) {
                                  throw new Error(
                                    data.message ||
                                      "Failed to update status"
                                  );
                                }

                                setBookings((currentBookings) =>
                                  currentBookings.map((item) =>
                                    item.id === booking.id
                                      ? {
                                          ...item,
                                          status: data.booking.status,
                                        }
                                      : item
                                  )
                                );
                              } catch (error) {
                                console.error(
                                  "Status update error:",
                                  error
                                );

                                alert(
                                  error instanceof Error
                                    ? error.message
                                    : "Failed to update booking status"
                                );
                              }
                            }}
                            className={`appearance-none rounded-full border px-3 py-1.5 pr-7 text-xs font-bold outline-none transition-all hover:shadow-sm focus:ring-2 focus:ring-slate-300 ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {booking.status === "Pending" && (
                              <>
                                <option value="Pending">Pending</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Cancelled">
                                  Cancelled
                                </option>
                              </>
                            )}

                            {booking.status === "Assigned" && (
                              <>
                                <option value="Assigned">Assigned</option>
                                <option value="On The Way">
                                  On The Way
                                </option>
                                <option value="Cancelled">
                                  Cancelled
                                </option>
                              </>
                            )}

                            {booking.status === "On The Way" && (
                              <>
                                <option value="On The Way">
                                  On The Way
                                </option>
                                <option value="In Progress">
                                  In Progress
                                </option>
                                <option value="Cancelled">
                                  Cancelled
                                </option>
                              </>
                            )}

                            {booking.status === "In Progress" && (
                              <>
                                <option value="In Progress">
                                  In Progress
                                </option>
                                <option value="Completed">
                                  Completed
                                </option>
                                <option value="Cancelled">
                                  Cancelled
                                </option>
                              </>
                            )}

                            {booking.status === "Completed" && (
                              <option value="Completed">
                                Completed
                              </option>
                            )}

                            {booking.status === "Cancelled" && (
                              <option value="Cancelled">
                                Cancelled
                              </option>
                            )}
                          </select>

                          <span
                            className={`pointer-events-none absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${getStatusDot(
                              booking.status
                            )}`}
                          />

                        </div>

                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5 text-right">

                        <span className="font-bold text-slate-900">
                          ₹
                          {Number(booking.amount).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </td>

                    </tr>

                  ))}

                  {/* Empty State */}
                  {filteredBookings.length === 0 && (

                    <tr>

                      <td
                        colSpan={8}
                        className="px-6 py-16 text-center"
                      >

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                          <svg
                            className="h-7 w-7"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                          </svg>

                        </div>

                        <p className="mt-4 font-bold text-slate-700">
                          No bookings found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or filter settings.
                        </p>

                        <button
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setDateFilter("All");
                          }}
                          className="mt-4 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          Reset Filters
                        </button>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="text-sm text-slate-500">

                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredBookings.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-slate-800">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredBookings.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {filteredBookings.length}
                </span>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    setItemsPerPage(Number(e.target.value))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm outline-none focus:border-slate-900"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(page - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-slate-950 px-3 text-xs font-bold text-white shadow-sm">
                  {currentPage}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  disabled={
                    currentPage >= totalPages ||
                    totalPages === 0
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>

              </div>

            </div>

          </section>
        )}

      </div>

      {/* =========================================================== */}
      {/* ANIMATION KEYFRAMES */}
      {/* =========================================================== */}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
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