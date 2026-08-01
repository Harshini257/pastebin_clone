const express = require("express");

const router = express.Router();

const {
  createPaste,
  getPastes,
  getPasteById,
  updatePaste,
  deletePaste,
} = require("../controllers/pasteController");

/**
 * @swagger
 * /api/pastes:
 *   post:
 *     summary: Create a new paste
 *     tags: [Pastes]
 *     responses:
 *       201:
 *         description: Paste created successfully
 */
router.post("/", createPaste);

/**
 * @swagger
 * /api/pastes:
 *   get:
 *     summary: Get all pastes
 *     tags: [Pastes]
 *     responses:
 *       200:
 *         description: Returns all pastes
 */
router.get("/", getPastes);

/**
 * @swagger
 * /api/pastes/{id}:
 *   get:
 *     summary: Get a paste by ID
 *     tags: [Pastes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paste found
 */
router.get("/:id", getPasteById);

/**
 * @swagger
 * /api/pastes/{id}:
 *   put:
 *     summary: Update a paste
 *     tags: [Pastes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paste updated
 */
router.put("/:id", updatePaste);

/**
 * @swagger
 * /api/pastes/{id}:
 *   delete:
 *     summary: Delete a paste
 *     tags: [Pastes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paste deleted
 */
router.delete("/:id", deletePaste);

module.exports = router;