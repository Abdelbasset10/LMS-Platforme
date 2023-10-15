import React from 'react'
import Course from './Course'

type Props = {
    courses : CourseType[]
    userId:string
}

const Courses = ({courses,userId} : Props) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' >
        {courses.map((course,index)=>(
            <Course key={index} course={course} userId={userId} />
        ))}
    </div>
  )
}

export default Courses