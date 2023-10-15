const prisma = require("../utils/prisma");

const Mux = require("@mux/mux-node");

const { Video } = new Mux(
  process.env.MUX_ACCESS_TOKEN,
  process.env.MUX_SECRET_KEY
);

const createCourse = async (req, res) => {
  try {
    const { creatorId, title } = req.body;
    console.log(req.body);
    if (!creatorId || !title) {
      return res.status(400).json({ message: "Missed informations!" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: creatorId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Creator does not exists in users databse!" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        creatorId,
      },
    });

    return res.status(201).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchCourse = async (req,res) => {
  try {
    const {name} = req.query
    

    return res.status(200).json(courses)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

const getAllCourses = async (req,res) => {
  try {
    const {category, name} = req.query
    console.log(req.query)
    
    const courses = await prisma.course.findMany({
      where:{
        category:{
          name:category === "undefined" ? undefined : category,
        },
        title : {
          contains : name === "undefined" ? undefined : name
        },
        isPublished:true
      },
      include:{
        category:true,
        chapters:{
          where:{
            isPublished:true
          },
          include:{
            userProgresses:true
          }
        },
        
      }
    })

    return res.status(200).json(courses)
    

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getCourseAsStuent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        chapters: {
          where:{
            isPublished:true
          },
          include:{
            userProgresses:true
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getTeacherCouses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ message: "Teacher id is required!" });
    }

    const courses = await prisma.course.findMany({
      where: {
        creatorId: teacherId,
      },
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    const updateCourse = await prisma.course.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(updateCourse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const publishUnPublishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const { isPublished } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    if (isPublished === true) {
      const hasPublishedChapters = await course.chapters.some(
        (c) => c.isPublished === true
      );
      if (!hasPublishedChapters) {
        return res.status({
          message: "Course must has at lest 1 published chapter",
        });
      }
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },
      data: {
        isPublished,
      },
    });

    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    const associatedChapters = await prisma.chapter.findMany({
      where: {
        courseId: id,
      },
      include: {
        muxData: true,
      },
    });

    for (const chapter of associatedChapters) {
      if (chapter.video) {
        await Video.Assets.del(chapter.muxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: chapter.muxData.id,
          },
        });
      }
      await prisma.chapter.delete({
        where: {
          id: chapter.id,
          courseId: id,
        },
      });
    }

    const deletedCourse = await prisma.course.delete({
      where: {
        id,
      },
    });

    return res.status(200).json(deletedCourse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  getCourseAsStuent,
  getTeacherCouses,
  updateCourse,
  publishUnPublishCourse,
  deleteCourse,
  searchCourse
};
