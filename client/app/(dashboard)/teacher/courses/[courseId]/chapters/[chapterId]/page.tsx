import Banner from '@/components/dashboard/course/Banner'
import Action from '@/components/dashboard/course/chapter/Action'
import ChapterDescForm from '@/components/dashboard/course/chapter/ChapterDescForm'
import ChaptersTitleForm from '@/components/dashboard/course/chapter/ChapterTitleForm'
import ChapterVideoForm from '@/components/dashboard/course/chapter/ChapterVideoForm'
import handleFetch from '@/helpers/handleFetch'
import { ArrowLeft, ArrowLeftIcon, LayoutDashboard, Video } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const ChapterPage = async ({params}:{params:{courseId:string,chapterId:string}}) => {
    const cookiesStore = cookies()
    const courseId = params.courseId
    const chapterId = params.chapterId

    const refToken = cookiesStore.get("refreshToken")
    const accessToken = cookiesStore.get("accessToken")
    const refreshToken = JSON.parse(refToken!.value)

    const chapter : ChapterType = await handleFetch(`/chapter/${courseId}/${chapterId}`,"GET",undefined,refreshToken,accessToken)
    if(!chapter || chapter.message){
        return redirect(`/teacher/courses/${courseId}`)
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.video
    ]

    const chapterFields = requiredFields.filter(Boolean)

    return (
        <div className='h-[calc(100vh-5rem)] overflow-y-auto' >
            {!chapter?.isPublished && (
                <Banner label='This chapter is not published. it will not be visible to students!' />
            )}
            <div className='px-6 py-4' >
                <Link href={`/teacher/courses/${courseId}`} >
                    <div className='flex items-center text-slate-700' >
                        <ArrowLeftIcon />
                        <p>Back to courses setup</p>
                    </div>
                </Link>
                <div className='flex items-center justify-between' >
                    <div className='mt-2' >
                        <h1 className='text-3xl font-bold' >Chapter creation</h1>
                        <p className='text-slate-500' >complete all fields ({chapterFields.length}/{requiredFields.length})</p>
                    </div>
                    <Action 
                        isPublished={chapter.isPublished} 
                        isDisabled={chapterFields.length/requiredFields.length !==1}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
                <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-2' >
                    <div>
                        <div className='flex items-center gap-2 mb-4' >
                            <div className='text-sky-500 p-[5px] bg-sky-200 rounded-full' >
                                <LayoutDashboard />
                            </div>
                            <p className='font-semibold' >Customize your Chapter</p>
                        </div>
                        <ChaptersTitleForm title={chapter?.title} courseId={courseId} chapterId={chapterId} />
                        <ChapterDescForm description={chapter.description} courseId={courseId} chapterId={chapterId} />
                    </div>
                    <div>
                        <div className='flex items-center gap-2 mb-4' >
                            <div className='text-sky-500 p-[5px] bg-sky-200 rounded-full' >
                                <Video />
                            </div>
                            <p className='font-semibold' >Add a video</p>
                        </div>
                        <ChapterVideoForm chapterId={chapterId} courseId={courseId} video={chapter?.video} playbackId={chapter?.muxData?.playbackId} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ChapterPage