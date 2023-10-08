const express = require("express");
const {
  createCourse,
  getCourse,
  updateCourse,
  publishUnPublishCourse,
  deleteCourse,
  getTeacherCouses,
} = require("../controllers/course");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, createCourse);
router.get("/teacher/:teacherId", verifyToken, getTeacherCouses);
router.get("/:id", verifyToken, getCourse);
router.patch("/publish/:id", verifyToken, publishUnPublishCourse);
router.patch("/:id", verifyToken, updateCourse);
router.delete("/delete/:id", verifyToken, deleteCourse);

module.exports = router;
