const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// GET all services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        category,
        description,
        base_price,
        estimated_minutes,
        created_at
      FROM services
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Services API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

module.exports = router;
