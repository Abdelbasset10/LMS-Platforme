const express = require("express");
const {
  createChapter,
  updateChapterPositions,
  getChapter,
  updateChapter,
  publishUnPublishChpter,
  deleteChapter,
} = require("../controllers/chapter");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/:courseId", verifyToken, createChapter);
router.patch("/update/:courseId/:chapterId", verifyToken, updateChapter);
router.patch(
  "/publish/:courseId/:chapterId",
  verifyToken,
  publishUnPublishChpter
);
router.patch("/:courseId", verifyToken, updateChapterPositions);
router.get("/:courseId/:chapterId", verifyToken, getChapter);
router.delete("/delete/:courseId/:chapterId", verifyToken, deleteChapter);

module.exports = router;
