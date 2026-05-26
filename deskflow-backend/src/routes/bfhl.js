const express = require('express');
const router = express.Router();

/**
 * GET /bfhl
 * Returns the operation code.
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    operation_code: 1
  });
});

/**
 * POST /bfhl
 * Processes input data array and extracts numbers, alphabets, and the highest alphabet.
 */
router.post('/', (req, res) => {
  try {
    const { data } = req.body;

    // Validate that data is provided and is an array
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input. 'data' must be an array."
      });
    }

    const numbers = [];
    const alphabets = [];

    // Separate numbers and alphabets
    data.forEach((item) => {
      const str = String(item).trim();
      if (!str) return;

      // Check if it is a number
      if (/^\d+$/.test(str)) {
        numbers.push(str);
      } 
      // Check if it is an alphabet (single character a-z or A-Z)
      else if (/^[a-zA-Z]$/.test(str)) {
        alphabets.push(str);
      }
    });

    // Find the highest alphabet (case-insensitive)
    let highest_alphabet = [];
    if (alphabets.length > 0) {
      let highest = alphabets[0];
      for (let i = 1; i < alphabets.length; i++) {
        if (alphabets[i].toLowerCase() > highest.toLowerCase()) {
          highest = alphabets[i];
        }
      }
      highest_alphabet = [highest];
    }

    return res.status(200).json({
      is_success: true,
      user_id: "nihal_tarwariya_15092002",
      email: "nihaltarwariya@gmail.com",
      roll_number: "21BCE10243",
      numbers,
      alphabets,
      highest_alphabet
    });
  } catch (err) {
    console.error('POST /bfhl error:', err);
    return res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

module.exports = router;
