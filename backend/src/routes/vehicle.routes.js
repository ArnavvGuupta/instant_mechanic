const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// GET all vehicles with customer information
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id,
        v.customer_id,
        v.make,
        v.model,
        v.year,
        v.registration_number,
        v.fuel_type,
        v.created_at,
        c.name AS customer_name
      FROM vehicles v
      LEFT JOIN customers c
        ON v.customer_id = c.id
      ORDER BY v.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Vehicles API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
});

module.exports = router;