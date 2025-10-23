// backend/controllers/announcementController.js
const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const announcement = new Announcement({ title, description, date, postedBy: req.user._id });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    console.error('createAnnouncement error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    // return all announcements sorted newest first
    const announcements = await Announcement.find().sort({ date: -1, createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error('getAnnouncements error:', err);
    res.status(500).json({ message: err.message });
  }
};

// New: delete announcement by id (admin only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: 'Announcement not found' });

    await Announcement.findByIdAndDelete(id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error('deleteAnnouncement error:', err);
    res.status(500).json({ message: err.message });
  }
};
