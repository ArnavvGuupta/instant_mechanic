const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// CREATE a new booking
router.post("/", async (req, res) => {
  try {
    const {
      customer_id,
      vehicle_id,
      service_id,
      mechanic_id,
      scheduled_at,
      notes,
    } = req.body;

    // Basic validation
    if (
      !customer_id ||
      !vehicle_id ||
      !service_id ||
      !mechanic_id ||
      !scheduled_at
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer, vehicle, service, mechanic and scheduled time are required",
      });
    }

    // Get service price
    const serviceResult = await pool.query(
      `
      SELECT base_price
      FROM services
      WHERE id = $1
      `,
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const amount = serviceResult.rows[0].base_price;

    // Generate booking number
    const bookingNumber = `BK-${Date.now()}`;

    // Create booking
    const result = await pool.query(
      `
      INSERT INTO bookings (
        booking_number,
        customer_id,
        vehicle_id,
        service_id,
        mechanic_id,
        status,
        amount,
        scheduled_at,
        notes
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        'Pending',
        $6,
        $7,
        $8
      )
      RETURNING *
      `,
      [
        bookingNumber,
        customer_id,
        vehicle_id,
        service_id,
        mechanic_id,
        amount,
        scheduled_at,
        notes || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: result.rows[0],
    });

  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
});
// GET all bookings
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.booking_number,
        b.status,
        b.amount,
        b.scheduled_at,
        b.created_at,

        c.name AS customer_name,

        v.make AS vehicle_make,
        v.model AS vehicle_model,
        v.registration_number,

        s.name AS service_name,

        m.name AS mechanic_name

      FROM bookings b

      LEFT JOIN customers c
        ON b.customer_id = c.id

      LEFT JOIN vehicles v
        ON b.vehicle_id = v.id

      LEFT JOIN services s
        ON b.service_id = s.id

      LEFT JOIN mechanics m
        ON b.mechanic_id = m.id

      ORDER BY b.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Bookings API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});
// GET booking by ID with full details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.booking_number,
        b.status,
        b.amount,
        b.scheduled_at,
        b.created_at,
        b.updated_at,
        b.started_at,
        b.completed_at,
        b.cancelled_at,
        b.notes,

        -- Customer
        c.id AS customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,

        -- Vehicle
        v.id AS vehicle_id,
        v.make AS vehicle_make,
        v.model AS vehicle_model,
        v.year AS vehicle_year,
        v.registration_number,
        v.fuel_type,

        -- Service
        s.id AS service_id,
        s.name AS service_name,
        s.category AS service_category,
        s.description AS service_description,
        s.base_price AS service_base_price,
        s.estimated_minutes,

        -- Mechanic
        m.id AS mechanic_id,
        m.name AS mechanic_name,
        m.phone AS mechanic_phone,
        m.status AS mechanic_status

      FROM bookings b

      LEFT JOIN customers c
        ON b.customer_id = c.id

      LEFT JOIN vehicles v
        ON b.vehicle_id = v.id

      LEFT JOIN services s
        ON b.service_id = s.id

      LEFT JOIN mechanics m
        ON b.mechanic_id = m.id

      WHERE b.id = $1
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Booking details API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
});
// UPDATE booking status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Assigned",
      "On The Way",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    // Get current booking status
    const currentBooking = await pool.query(
      `
      SELECT status
      FROM bookings
      WHERE id = $1::uuid
      `,
      [id]
    );

    if (currentBooking.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const currentStatus = currentBooking.rows[0].status;

    const allowedTransitions = {
      Pending: ["Assigned", "Cancelled"],
      Assigned: ["On The Way", "Cancelled"],
      "On The Way": ["In Progress", "Cancelled"],
      "In Progress": ["Completed", "Cancelled"],
      Completed: [],
      Cancelled: [],
    };

    if (
      currentStatus !== status &&
      !allowedTransitions[currentStatus]?.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking status from ${currentStatus} to ${status}`,
      });
    }

    const result = await pool.query(
      `
      UPDATE bookings
      SET
        status = $1::text,
        updated_at = NOW(),
        started_at = CASE
          WHEN $1::text = 'In Progress'
            THEN COALESCE(started_at, NOW())
          WHEN $1::text IN ('Pending', 'Assigned', 'On The Way')
            THEN NULL
          ELSE started_at
        END,
        completed_at = CASE
          WHEN $1::text = 'Completed'
            THEN COALESCE(completed_at, NOW())
          WHEN $1::text IN ('Pending', 'Assigned', 'On The Way', 'In Progress')
            THEN NULL
          ELSE completed_at
        END,
        cancelled_at = CASE
          WHEN $1::text = 'Cancelled'
            THEN COALESCE(cancelled_at, NOW())
          WHEN $1::text IN (
            'Pending',
            'Assigned',
            'On The Way',
            'In Progress',
            'Completed'
          )
            THEN NULL
          ELSE cancelled_at
        END
      WHERE id = $2::uuid
      RETURNING *
      `,
      [status, id]
    );

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
});
module.exports = router;