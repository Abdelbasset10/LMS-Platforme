'use client'
import Loading from '@/components/loading/Loading'
import { Button } from '@/components/ui/button'
import handleFetch from '@/helpers/handleFetch'
import { useAppSelector } from '@/redux/hooks'
import MuxPlayer from '@mux/mux-player-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
    chapter:ChapterType,
    courseId:string,
    chapterId:string
}

const ChapterComponent = ({chapter,courseId,chapterId} : Props) => {    
    const router = useRouter()
    const {user,refreshToken,accessToken} = useAppSelector((state)=>state.user)
    const [loading,setLoading] = useState(false)

    const isComplted = chapter.userProgresses?.some((u)=>u.chapterId === chapter.id && u.userId === user?.id && u.isCompleted === true)

    const [isMounted,setIsMountd] = useState(true)

    const handleComplete = async () => {
        const userInfo = {
            userId:user.id
        }
        try {
            setLoading(true)
            const res = await handleFetch(`/chapter/complete/${courseId}/${chapterId}`,"PATCH",userInfo,refreshToken,accessToken)
            router.refresh()
        } catch (error : any) {
            toast.error(error?.message)
        }
        finally {
            setLoading(false)
        }

    }


    useEffect(()=>{
        setIsMountd(false)
    },[])

    if(isMounted){
        return <Loading />
    }

  return (
    <div>
        <MuxPlayer
            className="h-96"
            playbackId={chapter.muxData?.playbackId!}
        />
        <div className='flex flex-wrap items-center justify-between my-4' >
            <h1 className='font-semibold text-xl' >{chapter.title}</h1>
            {isComplted ? (
                <Button disabled variant="outline" className='text-green-500 rounded-[8px]' >Complted</Button>
            ) : (
                <Button disabled={loading} variant="outline" className='text-sky-500 rounded-[8px]' onClick={handleComplete} >Mark as completed</Button>
            )}
        </div>
        <p dangerouslySetInnerHTML={{__html: chapter.description!}} />
    </div>
  )
}

export default ChapterComponent