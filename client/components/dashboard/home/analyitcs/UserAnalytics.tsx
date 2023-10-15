import { CheckCircle, Clock } from 'lucide-react'
import React from 'react'

type Props = {
    courses:CourseType[]
    userId:string
}

const UserAnalytics = ({courses,userId} : Props) => {
    const coursesComplted = courses.filter((course)=>course.chapters.length === course.chapters.filter((chapter)=>chapter.userProgresses.some((u)=>u.chapterId === chapter.id && u.userId === userId && u.isCompleted === true)).length)

    const coursesInProgress = courses.filter((course)=>course.chapters.length > course.chapters.filter((chapter)=>chapter.userProgresses.find((u)=>u.chapterId === chapter.id && u.userId === userId && u.isCompleted === true)).length)

    const ok = coursesInProgress.filter((course)=>course.chapters.find((chapter)=>chapter.userProgresses.length > 0))

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 my-4' >
        <div className='border rounded-[8px] flex items-center gap-2 p-2' >
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-sky-500' >
                <Clock className='text-sky-200' />
            </div>
            <div>
                <p>In Progress</p>
                <p>{ok.length}</p>
            </div>     
        </div>
        <div className='border rounded-[8px] flex items-center gap-2 p-2' >
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-green-500' >
                <CheckCircle className='text-green-200' />
            </div>
            <div>
                <p>Completed</p>
                <p>{coursesComplted.length}</p>
            </div>     
        </div>
    </div>
  )
}

export default UserAnalytics