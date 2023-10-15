import ChapterComponent from '@/components/dashboard/chapter/ChapterComponent'
import handleFetch from '@/helpers/handleFetch'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const ChapterPage = async ({params}:{params:{courseId:string,chapterId:string}}) => {
  const cookiesStore = cookies()
    const refreshToken = cookiesStore.get("refreshToken")
    const accessToken = cookiesStore.get("accessToken")
    const parsedRefreshToken = JSON.parse(refreshToken?.value!)

  const chapter : ChapterType = await handleFetch(`/chapter/${params.courseId}/${params.chapterId}`,"GET",undefined,parsedRefreshToken,accessToken)

  if(!chapter || chapter.message){
    return redirect(`/${params.courseId}`)
  }

  return (
    <div className='h-[calc(100vh-5rem)] overflow-y-auto'>
      <div className='w-10/12 mx-auto py-4 h-full' >
        <ChapterComponent chapter={chapter} courseId={params.courseId} chapterId={params.chapterId} />
      </div>
    </div>
  )
}

export default ChapterPage