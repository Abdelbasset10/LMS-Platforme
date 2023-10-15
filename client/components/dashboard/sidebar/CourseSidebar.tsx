'use client'
import Image from 'next/image'
import React from 'react'

import { Separator } from "@/components/ui/separator"
import NavRoute from './NavRoute'
import { Compass, Layout } from 'lucide-react'
import { studentRoutes, teacherRoutes } from './navs'
import { usePathname } from 'next/navigation'
import ChapterRoute from './ChapterRoute'
import { Progress } from '@/components/ui/progress'

type Props = {
  title:string
  userId:string
  chapters:ChapterType[]
}

const CourseSidebar = ({title,userId,chapters} : Props) => {
  const completedCourses = chapters.filter((chapter)=>chapter.userProgresses?.some((u)=>u.chapterId === chapter.id && u.userId === userId && u.isCompleted === true))
  const courseProgress = completedCourses.length / chapters.length * 100
  return (
    <div className='w-full h-full border-r z-50 ' >
      <div className='h-20  px-4 py-4 border-b' >
        <h1>{title}</h1>
        <Progress value={courseProgress}  className='mb-1 h-2' />
        <p className='text-sm' >{courseProgress}% completed</p>
      </div>
      <div className='flex flex-col' >
        {
          chapters.map((chapter,index)=>(
            <ChapterRoute userId={userId} key={index} chapter={chapter} />
          ))
        }

          

      </div>
    </div>
  )
}

export default CourseSidebar