import { cookies, headers } from 'next/headers'

import handleFetch from '@/helpers/handleFetch'
import React from 'react'
import { redirect } from 'next/navigation'
import { LayoutDashboard, ListChecks } from 'lucide-react'
import TitleForm from '@/components/dashboard/course/TitleForm'
import DescriptionForm from '@/components/dashboard/course/descriptionForm'
import PriceForm from '@/components/dashboard/course/PriceForm'
import ImageForm from '@/components/dashboard/course/ImageForm'
import CategoryForm from '@/components/dashboard/course/categoryForm'
import ChaptersForm from '@/components/dashboard/course/ChaptersForm'
import Banner from '@/components/dashboard/course/Banner'
import Action from '@/components/dashboard/course/Actions'

const CoursePage = async ({params}:{params:{courseId:string}}) => {
  const cookiesStore = cookies()
  const courseId = params.courseId
  
  const refToken = cookiesStore.get("refreshToken")
  const accessToken = cookiesStore.get("accessToken")

  const refreshToken = JSON.parse(refToken!.value)
  

  const course : CourseType = await handleFetch(`/course/${courseId}`,"GET",undefined,refreshToken,accessToken)
  const categories = await handleFetch(`/category`,"GET",undefined,refreshToken,accessToken)
  const haschapter = course?.chapters?.length > 0 ? course?.chapters?.some((c)=>c?.isPublished === true) : false
  const courseFields = [
    course?.title,
    course?.description,
    course?.image,
    course?.price,
    course?.categoryId,
    haschapter
  ]

  const courseLength = courseFields.filter(Boolean)
  
  if(!course || course?.message){
    return redirect("/teacher/courses")
  }



  return (
    <div className='h-[calc(100vh-5rem)] overflow-y-auto'>
      {!course?.isPublished && (
        <Banner label='This course is not published. it will not be visible to students!' />
      )}
      <div className='px-6 py-4' >
        <div className='flex items-center justify-between' >
          <div>
            <h1 className='text-3xl font-bold' >Course setup</h1>
            <p className='text-slate-500' >complete all fields ({courseLength.length}/{courseFields.length})</p>
          </div>
          <Action courseId={courseId} isPublished={course.isPublished} isDisabled={courseLength.length / courseFields.length !== 1} />
        </div>
        <div className='mt-8 ' >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8' >
            <div>
              <div className='flex items-center gap-2 mb-4' >
                <div className='text-sky-500 p-[5px] bg-sky-200 rounded-full' >
                  <LayoutDashboard />
                </div>
                <p className='font-semibold' >Customize your Course</p>
              </div>
              <div className='flex flex-col gap-4' >
                <TitleForm title={course.title} courseId={courseId} />
                <DescriptionForm description={course.description} courseId={courseId} />
                <ImageForm image={course.image} courseId={courseId} />
                <CategoryForm categories={categories} categoryId={course.categoryId} courseId={courseId} />
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2 mb-4' >
                <div className='text-sky-500 p-[5px] bg-sky-200 rounded-full' >
                  <ListChecks />
                </div>
                <p className='font-semibold' >Course chapters</p>
              </div>
              <div className='flex flex-col gap-4' >
                <ChaptersForm chapters={course.chapters} courseId={courseId} />
                <PriceForm price={course.price} courseId={courseId} />
              </div>
            </div>          
          </div>
        </div>
      </div>

    </div>
  )
}

export default CoursePage