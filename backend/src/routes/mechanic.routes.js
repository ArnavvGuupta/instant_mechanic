const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// GET all mechanics
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        status,
        jobs_completed,
        current_location,
        created_at,
        updated_at
      FROM mechanics
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Mechanics API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch mechanics",
      error: error.message,
    });
  }
});

module.exports = router;

