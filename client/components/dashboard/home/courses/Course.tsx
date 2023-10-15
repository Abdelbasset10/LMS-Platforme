import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'


type Props = {
    course : CourseType
    userId:string
}

const Course = ({course,userId} : Props) => {
  const completedCourses = course.chapters.filter((chapter)=>chapter.userProgresses?.some((u)=>u.chapterId === chapter.id && u.userId === userId && u.isCompleted === true))
  const courseProgress = completedCourses.length / course.chapters.length * 100
  return (
    <div  className='p-2 border border-slate-200 rounded-[8px] cursor-pointer hover:-translate-y-2'>
        <Link href={`/${course.id}`} >
          <div className='w-full h-40 relative' >
              <Image src={course.image!} fill alt='course image' className='rounded-[8px] hover:scale-90' />
          </div>
          <div className='mt-2' >
            <h3 className='font-semibold' >{course.title}</h3>
            <p className='text-slate-500 my-2' >{course.category.name}</p>
            <div  className='flex items-center gap-2 mb-2'>
              <BookOpen className='text-sky-500' />
              <p>{course.chapters?.length} chapters</p>
            </div>
            <div>
              <Progress value={courseProgress}  className='mb-1 h-2' />
              <p className='text-sm italic text-slate-700' >{courseProgress ? courseProgress.toFixed(2) : courseProgress}% completed</p>
            </div>
          </div>
        </Link>
        
    </div>
  )
}

export default Course