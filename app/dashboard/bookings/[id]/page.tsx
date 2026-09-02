"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Booking = {
    id: string;
    booking_number: string;
    status: string;
    amount: number | string;
    scheduled_at: string | null;
    created_at: string;

    customer_id: string | null;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;

    vehicle_id: string | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
    vehicle_year: number | null;
    registration_number: string | null;
    fuel_type: string | null;

    service_id: string | null;
    service_name: string | null;
    service_category: string | null;
    service_description: string | null;
    service_base_price: number | string | null;
    estimated_minutes: number | null;

    mechanic_id: string | null;
    mechanic_name: string | null;
    mechanic_phone: string | null;
    mechanic_status: string | null;

    notes: string | null;
};

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        async function loadBooking() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/bookings/${id}`
                );

                if (!response.ok) {
                    throw new Error(`Booking API failed: ${response.status}`);
                }

                const data = await response.json();

                setBooking(data);
            } catch (err) {
                console.error("Booking details error:", err);
                setError("Unable to load booking");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadBooking();
        }
    }, [id]);

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
    const updateStatus = async (newStatus: string) => {
        if (!booking || updatingStatus) return;

        try {
            setUpdatingStatus(true);

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
                throw new Error(data.message || "Failed to update status");
            }

            setBooking(data.booking);
        } catch (error) {
            console.error("Status update error:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to update booking status"
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    function getStatusClass(status: string) {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800";

            case "Pending":
                return "bg-yellow-100 text-yellow-800";

            case "Cancelled":
                return "bg-red-100 text-red-800";

            case "In Progress":
                return "bg-blue-100 text-blue-800";

            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f8fa] p-8">
                <div className="mx-auto max-w-[1200px] rounded-2xl border bg-white p-12 text-center shadow-sm">
                    <p className="font-medium text-gray-600">
                        Loading booking...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#f7f8fa] p-8">
                <div className="mx-auto max-w-[1200px]">
                    <button
                        onClick={() => router.back()}
                        className="mb-5 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        ← Back
                    </button>

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                        {error || "Booking not found"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fa] text-gray-900">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-[1200px] px-5 py-5 sm:px-8">

                    <button
                        onClick={() => router.back()}
                        className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        ← Back to Bookings
                    </button>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm text-gray-400">
                                Booking Details
                            </p>

                            <h1 className="mt-1 text-2xl font-bold text-gray-900">
                                {booking.booking_number}
                            </h1>
                        </div>

                        <select
                            value={booking.status}
                            disabled={updatingStatus}
                            onChange={(e) => updateStatus(e.target.value)}
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${updatingStatus ? "cursor-not-allowed opacity-60" : ""
                                } ${getStatusClass(booking.status)}`}
                        >
                            {booking.status === "Pending" && (
                                <>
                                    <option value="Pending">Pending</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Cancelled">Cancelled</option>
                                </>
                            )}

                            {booking.status === "Assigned" && (
                                <>
                                    <option value="Assigned">Assigned</option>
                                    <option value="On The Way">On The Way</option>
                                    <option value="Cancelled">Cancelled</option>
                                </>
                            )}

                            {booking.status === "On The Way" && (
                                <>
                                    <option value="On The Way">On The Way</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Cancelled">Cancelled</option>
                                </>
                            )}

                            {booking.status === "In Progress" && (
                                <>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </>
                            )}

                            {booking.status === "Completed" && (
                                <option value="Completed">Completed</option>
                            )}

                            {booking.status === "Cancelled" && (
                                <option value="Cancelled">Cancelled</option>
                            )}
                        </select>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1200px] space-y-6 p-5 sm:p-8">

                {/* Booking Information */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold">
                        Booking Information
                    </h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                                Booking Number
                            </p>
                            <p className="mt-1 font-semibold">
                                {booking.booking_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                                Amount
                            </p>
                            <p className="mt-1 font-semibold">
                                ₹{Number(booking.amount || 0).toLocaleString("en-IN")}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                                Scheduled
                            </p>
                            <p className="mt-1 font-semibold">
                                {formatDate(booking.scheduled_at)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-400">
                                Created
                            </p>
                            <p className="mt-1 font-semibold">
                                {formatDate(booking.created_at)}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Customer + Vehicle */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Customer */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Customer
                        </h2>

                        <div className="mt-5 space-y-4">

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Name
                                </p>
                                <p className="mt-1 font-semibold">
                                    {booking.customer_name || "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Email
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.customer_email || "No email"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Phone
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.customer_phone || "No phone"}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Vehicle */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Vehicle
                        </h2>

                        <div className="mt-5 grid grid-cols-2 gap-4">

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Make
                                </p>
                                <p className="mt-1 font-semibold">
                                    {booking.vehicle_make || "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Model
                                </p>
                                <p className="mt-1 font-semibold">
                                    {booking.vehicle_model || "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Year
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.vehicle_year || "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Registration
                                </p>
                                <p className="mt-1 font-semibold">
                                    {booking.registration_number || "No registration"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Fuel Type
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.fuel_type || "Unknown"}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Service + Mechanic */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Service */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Service
                        </h2>

                        <div className="mt-5 space-y-4">

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Service
                                </p>
                                <p className="mt-1 font-semibold">
                                    {booking.service_name || "Unknown"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Category
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.service_category || "No category"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Description
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.service_description || "No description"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Base Price
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        ₹{Number(
                                            booking.service_base_price || 0
                                        ).toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-400">
                                        Estimated Time
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {booking.estimated_minutes
                                            ? `${booking.estimated_minutes} mins`
                                            : "Unknown"}
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* Mechanic */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Mechanic
                        </h2>

                        <div className="mt-5 space-y-4">

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Name
                                </p>
                                <p className="mt-1 font-semibold">
                                    {booking.mechanic_name || "Unassigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Phone
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.mechanic_phone || "No phone"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-400">
                                    Status
                                </p>
                                <p className="mt-1 text-gray-700">
                                    {booking.mechanic_status || "Unknown"}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Notes */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold">
                        Notes
                    </h2>

                    <p className="mt-3 text-gray-600">
                        {booking.notes || "No notes added for this booking."}
                    </p>
                </div>

            </main>
        </div>
    );
}