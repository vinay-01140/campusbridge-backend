// backend/routes/announcements.js
const express = require('express');
const router = express.Router();
const { auth, requireAdmin } = require('../middleware/auth');
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');

router.post('/', auth, requireAdmin, createAnnouncement);
router.get('/', auth, getAnnouncements);
router.delete('/:id', auth, requireAdmin, deleteAnnouncement); // new delete route

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const Suggestion = require('../models/Suggestion');
  try {
    const s = await Suggestion.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
