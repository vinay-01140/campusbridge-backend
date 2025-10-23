// backend/routes/suggestions.js
const express = require('express');
const router = express.Router();
const { auth, requireAdmin } = require('../middleware/auth');
const { createSuggestion, getUserSuggestions, getAllSuggestions, updateStatus, deleteSuggestion } = require('../controllers/suggestionController');

router.post('/', auth, createSuggestion);
router.get('/user/:userId', auth, getUserSuggestions);
router.get('/', auth, requireAdmin, getAllSuggestions);
router.patch('/:id/status', auth, requireAdmin, updateStatus);
router.delete('/:id', auth, requireAdmin, deleteSuggestion); // new delete route
// delete suggestion (admin)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const Suggestion = require('../models/Suggestion');
  try {
    const s = await Suggestion.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
