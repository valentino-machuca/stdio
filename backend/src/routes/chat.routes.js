const express = require('express');
const router = express.Router();

// Placeholder route
router.get('/', (req, res) => res.json({ message: 'chat route working' }));

module.exports = router;
