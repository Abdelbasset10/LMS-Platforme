const express = require("express");
const {
  createCourse,
  getCourse,
  updateCourse,
  publishUnPublishCourse,
  deleteCourse,
  searchCourse,
  getTeacherCouses,
  getAllCourses,
  getCourseAsStuent,
} = require("../controllers/course");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, createCourse);
router.get("/teacher/:teacherId", verifyToken, getTeacherCouses);
router.get("/",verifyToken,getAllCourses)
router.get("/name",verifyToken,searchCourse)
router.get("/student/:id", verifyToken, getCourseAsStuent);
router.get("/:id", verifyToken, getCourse);
router.patch("/publish/:id", verifyToken, publishUnPublishCourse);
router.patch("/:id", verifyToken, updateCourse);
router.delete("/delete/:id", verifyToken, deleteCourse);

module.exports = router;
