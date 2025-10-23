// backend/controllers/suggestionController.js
const Suggestion = require('../models/Suggestion');

exports.createSuggestion = async (req, res) => {
  try {
    console.log('createSuggestion: req.user=', req.user && req.user._id);
    console.log('createSuggestion: body=', req.body);

    const description = req.body.description ?? req.body.text ?? req.body.title ?? '';
    const title = req.body.title ?? (description && description.slice(0, 60));
    const category = req.body.category ?? req.body.Category ?? 'others';

    if (!description) {
      return res.status(400).json({ message: 'description required' });
    }

    const suggestion = new Suggestion({
      user: req.user ? req.user._id : null,
      category,
      title,
      description
    });

    await suggestion.save();
    return res.status(201).json(suggestion);
  } catch (err) {
    console.error('createSuggestion error:', err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getUserSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find().populate('user','name email').sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ message: 'Not found' });
    suggestion.status = status || suggestion.status;
    await suggestion.save();
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// New: delete suggestion (admin only)
exports.deleteSuggestion = async (req, res) => {
  try {
    const id = req.params.id;
    const suggestion = await Suggestion.findById(id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    await Suggestion.findByIdAndDelete(id);
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    console.error('deleteSuggestion error:', err);
    res.status(500).json({ message: err.message });
  }
};
