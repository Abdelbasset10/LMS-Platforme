const prisma = require("../utils/prisma");
const Mux = require("@mux/mux-node");

const { Video } = new Mux(
  process.env.MUX_ACCESS_TOKEN,
  process.env.MUX_SECRET_KEY
);


const createChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    if (course.chapters.length === 0) {
      const newChapter = await prisma.chapter.create({
        data: {
          title,
          courseId,
          position: 0,
        },
      });

      await prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          chapters: {
            connect: {
              id: newChapter.id,
            },
          },
        },
      });

      return res.status(201).json(newChapter);
    } else {
      const newChapter = await prisma.chapter.create({
        data: {
          title,
          courseId,
          position: course.chapters.length,
        },
      });

      await prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          chapters: {
            connect: {
              id: newChapter.id,
            },
          },
        },
      });

      return res.status(201).json(newChapter);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateChapterPositions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { desPos, sourcePos } = req.body;


    if (!courseId) {
      return res.status(400).json({ message: "Course id is required!" });
    }

    if (desPos === undefined || !sourcePos === undefined) {
      return res.status(400).json({ message: "Missing position values!" });
    }

    const desChapter = await prisma.chapter.findFirst({
      where: {
        courseId,
        position: desPos,
      },
    });

    const sourceChapter = await prisma.chapter.findFirst({
      where: {
        courseId,
        position: sourcePos,
      },
    });

    const updatedDesChapter = await prisma.chapter.update({
      where: {
        id: desChapter.id,
      },
      data: {
        position: sourcePos,
      },
    });

    const updatedSourceChapter = await prisma.chapter.update({
      where: {
        id: sourceChapter.id,
      },
      data: {
        position: desPos,
      },
    });

    return res.status(200).json({ message: "Updated positions" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getChapter = async (req, res) => {
  try {
    const { chapterId, courseId } = req.params;
    if (!chapterId || !courseId) {
      return res
        .status(400)
        .json({ message: "Chapter and course ids are required!" });
    }

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      include: {
        muxData: true,
        userProgresses:true
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: "Chapter does not exists!" });
    }

    return res.status(200).json(chapter);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateChapter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { isPublished, ...values } = req.body;

    if (!chapterId || !courseId) {
      return res
        .status(400)
        .json({ message: "Chapter and course ids are required!" });
    }

    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.video) {
      const isexistMuxData = await prisma.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      if (isexistMuxData) {
        await Video.Assets.del(isexistMuxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: isexistMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: values.video,
        playback_policy: [
          "public", // makes playback ID available on the asset
        ],
      });

      await prisma.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return res.status(200).json(chapter);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const publishUnPublishChpter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { isPublished } = req.body;

    if (!chapterId || !courseId) {
      return res
        .status(400)
        .json({ message: "Chapter and course ids are required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished,
      },
    });

    const hasPublishedChapters = course?.chapters?.some(
      (c) => c.isPublished === true
    );

    if (!hasPublishedChapters) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return res.status(200).json(chapter);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const markAsCompleted = async (req,res) => {
  try {
    const {courseId,chapterId} = req.params
    const {userId} = req.body

    if(!userId){
      return res.status(400).json({message:"User id is required"})
    }

    if (!chapterId || !courseId) {
      return res
        .status(400)
        .json({ message: "Chapter and course ids are required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include:{
        userProgresses:true
      }
    });

    if (!chapter) {
      return res.status(404).json({ message: "chapter does not exists!" });
    }

    if(chapter.userProgresses.some((u)=>u.chapterId=== chapter && u.userId === userId && u.isCompleted === true)){
      return res.status(400).json({message:"You already completed this message"})
    }

    const updatedProgress = await prisma.userProgess.create({
      data:{
        isCompleted:true,
        userId,
        chapterId
      }
    })

    return res.status(200).json(updatedProgress)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

const deleteChapter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    if (!chapterId || !courseId) {
      return res
        .status(400)
        .json({ message: "Chapter and course ids are required!" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course does not exists!" });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      include: {
        muxData: true,
        userProgresses:true
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: "chapter does not exists!" });
    }

    const nextChapters = await prisma.chapter.findMany({
      where: {
        courseId,
        position: {
          gt: chapter.position,
        },
      },
    });

    if (chapter.video) {
      Video.Assets.del(chapter.muxData.assetId);
      await prisma.muxData.delete({
        where: {
          id: chapter.muxData.id,
        },
      });
    }

    if(chapter.userProgresses.length > 0){
      for(const progress of chapter.userProgresses){
        await prisma.userProgess.delete({
          where:{
            id:progress.id,
            chapterId:chapter.id
          }
        })
      }
    }
    await prisma.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (nextChapters.length > 0) {
      for (const chapter of nextChapters) {
        const chapterPos = chapter.position;
        await prisma.chapter.update({
          where: {
            courseId,
            id: chapter.id,
          },
          data: {
            position: chapterPos - 1,
          },
        });
      }
    }

    const isCourseStayPublished = await prisma.course.findUnique({
      where:{
        id:courseId,
      },
      include:{
        chapters:true
      }
      
    })
    
    const ok = isCourseStayPublished.chapters.some((c)=>c.isPublished === true)

    if(!ok){
      await prisma.course.update({
        where:{
          id:courseId,
        },
        data:{
          isPublished:false
        }
      })
    }

    return res.status(200).json({ message: "Chapter deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChapter,
  updateChapterPositions,
  getChapter,
  updateChapter,
  publishUnPublishChpter,
  markAsCompleted,
  deleteChapter,
};
