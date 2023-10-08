const express = require("express");
const { getAllCategories } = require("../controllers/category");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, getAllCategories);

module.exports = router;
