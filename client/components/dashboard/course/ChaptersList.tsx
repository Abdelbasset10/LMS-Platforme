import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Grip, Loader2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import handleFetch from '@/helpers/handleFetch';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Props = {
    chapters : any
    courseId : any
}

const ChaptersList = ({chapters, courseId} : Props) => {
  const router = useRouter()
  const [chaptersData,setChaptersData] = useState(chapters)
  const [isOrdering,setIsOrdering] = useState(false)

  const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

  const handleDragEnd = async (result : any) => {
    if(!result.destination) return; 
    const startIndex = result.source.index
    const endIndex = result.destination.index
    const copyChapters = [...chaptersData]
    const [reordedChapters] = copyChapters .splice(startIndex,1)
    copyChapters.splice(endIndex,0,reordedChapters)
    setChaptersData(copyChapters)
    const values = {
      desPos:endIndex,
      sourcePos:startIndex
    }
    try {
      setIsOrdering(true)
      const res = await handleFetch(`/chapter/${courseId}`,"PATCH",values,refreshToken,accessToken)
      console.log(res)
      router.refresh()
      toast.success("Chapters ordered")
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsOrdering(false)
    }
    
  }

  const handleEditChapter = (chapterId : string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`)
  }

  useEffect(()=>{
    setChaptersData(chapters)
  },[chapters])

  return (
    <div  className='my-2 relative' >
      {isOrdering && (
        <div className='w-full h-full absolute bg-black/10 flex items-center justify-center' >
          <Loader2 className='animate-spin text-sky-500' />
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chaptersData">
          {(droppableProvider) => (
            <ul
              ref={droppableProvider.innerRef}
              {...droppableProvider.droppableProps}
            >
              <div className='flex flex-col gap-2' >
                {chaptersData.map((chapter : any, index : any) => (
                  <Draggable
                    index={index}
                    key={chapter.id}
                    draggableId={`${chapter.id}`}
                  >
                    {(draggableProvider) => (
                      <div
                      ref={draggableProvider.innerRef}
                      {...draggableProvider.draggableProps}
                      
                        className={cn('flex items-center justify-between flex-wrap gap-2 bg-slate-200 p-2 rounded-[8px]',chapter.isPublished && "bg-sky-200")}
                      >
                        <div className='flex items-center gap-2' >
                          <div {...draggableProvider.dragHandleProps}>
                            <Grip className='text-slate-500' />
                          </div>
                          <p>{chapter.title}</p>
                        </div>
                        <div className='flex items-center gap-2' >
                          <p className={`${chapter.isPublished ? "text-sky-500" : "text-slate-500"} text-sm italic`} >{chapter.isPublished ? "Published" : "Unpublished"}</p>
                          <Pencil className={`${chapter.isPublished ? "text-sky-500 hover:text-slate-500" : "text-slate-500 hover:text-black"} cursor-pointer text-sm italic `} onClick={()=>handleEditChapter(chapter.id)} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {droppableProvider.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default ChaptersList