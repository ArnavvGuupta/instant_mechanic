const express = require("express");
const cors = require("cors");

require("dotenv").config()

const pool = require("./src/config/db");
const app = express();
const PORT = process.env.PORT || 5000;
const bookingsRoutes = require("./src/routes/bookings.routes");
const customerRoutes = require("./src/routes/customer.routes");
const vehicleRoutes = require("./src/routes/vehicle.routes");
const mechanicRoutes = require("./src/routes/mechanic.routes");
const serviceRoutes = require("./src/routes/service.routes");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());
app.get("/api/customers-test", (req, res) => {
  res.json({
    message: "Customer route area is working",
  });
});

app.use("/api/bookings", bookingsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/services", serviceRoutes);




app.get("/", (req, res) => {
  res.json({
    message: "Instant Mechanic API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is healthy",
  });
});

// PostgreSQL test
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");

    res.json({
      success: true,
      message: "Express is connected to PostgreSQL",
      databaseTime: result.rows[0].time,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const customers = await pool.query(
      "SELECT COUNT(*) AS count FROM customers"
    );

    const mechanics = await pool.query(
      "SELECT COUNT(*) AS count FROM mechanics"
    );

    const vehicles = await pool.query(
      "SELECT COUNT(*) AS count FROM vehicles"
    );

    const bookings = await pool.query(
      "SELECT COUNT(*) AS count FROM bookings"
    );

    const revenue = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM bookings
      WHERE status = 'Completed'
    `);
    const averageBookingValue = await pool.query(`
  SELECT COALESCE(AVG(amount), 0) AS average
  FROM bookings
  WHERE status = 'Completed'
`);
    const completedBookings = await pool.query(`
  SELECT COUNT(*) AS count
  FROM bookings
  WHERE status = 'Completed'
`);

    res.json({
      completedBookings: Number(completedBookings.rows[0].count),
      completionRate:
        Number(bookings.rows[0].count) > 0
          ? Number(
            (
              (Number(completedBookings.rows[0].count) /
                Number(bookings.rows[0].count)) *
              100
            ).toFixed(1)
          )
          : 0,
      customers: Number(customers.rows[0].count),
      mechanics: Number(mechanics.rows[0].count),
      vehicles: Number(vehicles.rows[0].count),
      bookings: Number(bookings.rows[0].count),
      revenue: Number(revenue.rows[0].total),
      averageBookingValue: Number(averageBookingValue.rows[0].average),
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
});
app.get("/api/dashboard/recent-bookings", async (req, res) => {
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
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Recent bookings API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent bookings",
      error: error.message,
    });
  }
});

app.get("/api/dashboard/charts", async (req, res) => {
  try {
    const bookings = await pool.query(`
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*)::int AS bookings
  FROM bookings
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY DATE_TRUNC('month', created_at)
`);
    const status = await pool.query(`
  SELECT
    status,
    COUNT(*)::int AS count
  FROM bookings
  GROUP BY status
  ORDER BY count DESC
`);

    const revenue = await pool.query(`
  SELECT
   DATE_TRUNC('month', completed_at) AS month,
    COALESCE(SUM(amount), 0)::numeric AS revenue
  FROM bookings
  WHERE status = 'Completed'
    AND completed_at IS NOT NULL
  GROUP BY DATE_TRUNC('month', completed_at)
  ORDER BY DATE_TRUNC('month', completed_at)
`);

    res.json({
      bookings: bookings.rows,
      revenue: revenue.rows,
      status: status.rows
    });
  } catch (error) {
    console.error("Dashboard charts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard chart data",
      error: error.message,
    });
  }
});



app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});