const express = require("express");

const router = express.Router();

const {
  createPaste,
  getPastes,
  getPasteById,
  updatePaste,
  deletePaste,
} = require("../controllers/pasteController");

router.post("/", createPaste);

router.get("/", getPastes);

router.get("/:id", getPasteById);

router.put("/:id", updatePaste);

router.delete("/:id", deletePaste);

module.exports = router;