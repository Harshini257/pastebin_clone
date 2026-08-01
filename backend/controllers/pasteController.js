const Paste = require("../models/Paste");

// Create Paste
const createPaste = async (req, res) => {
  try {
    const { title, code, language } = req.body;

    const paste = await Paste.create({
      title,
      code,
      language,
    });

    res.status(201).json(paste);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Pastes
const getPastes = async (req, res) => {
  try {
    const pastes = await Paste.find().sort({ createdAt: -1 });

    res.json(pastes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Single Paste
const getPasteById = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);

    if (!paste) {
      return res.status(404).json({
        message: "Paste not found",
      });
    }

    res.json(paste);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Paste
const updatePaste = async (req, res) => {
  try {
    const { title, code, language } = req.body;

    const paste = await Paste.findByIdAndUpdate(
      req.params.id,
      {
        title,
        code,
        language,
      },
      {
        new: true,
      }
    );

    res.json(paste);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Paste
const deletePaste = async (req, res) => {
  try {
    await Paste.findByIdAndDelete(req.params.id);

    res.json({
      message: "Paste Deleted"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createPaste,
  getPastes,
  getPasteById,
  updatePaste,
  deletePaste,
};