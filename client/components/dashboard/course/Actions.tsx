'use client'

import { Button } from '@/components/ui/button'
import handleFetch from '@/helpers/handleFetch'
import { useAppSelector } from '@/redux/hooks'
import { LoaderIcon, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

type Props = {
    isPublished : boolean
    isDisabled : boolean
    courseId:string
}

const Action = ({isPublished, isDisabled,courseId} : Props) => {
    const { width, height } = useWindowSize()

  const router = useRouter()
  const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

  const [isLoading,setIsLoding] = useState(false)


  const handlePublish = async () => {
    const values = {
      isPublished:!isPublished
    }
    const loadingToastId = toast.loading('Wait moment please');
    try {
      setIsLoding(true)
      const res = await handleFetch(`/course/publish/${courseId}`,"PATCH",values,refreshToken,accessToken)
      if(res?.message){
        return toast.error(res.message)
      }
      router.refresh()
      
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    } finally {
      setIsLoding(false)
      toast.dismiss(loadingToastId)
    }

  }

  const handleDelete = async () => {
    const loadingToastId = toast.loading('Wait moment please');
    try {
      setIsLoding(true)
      const res = await handleFetch(`/course/delete/${courseId}`,"DELETE",undefined,refreshToken,accessToken)
      if(res?.message && res?.message !== "Chapter deleted"){
        return toast.error(res.message)
      } 
      router.push(`/teacher/courses`)
        router.refresh()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    } finally {
      setIsLoding(false)
      toast.dismiss(loadingToastId)
    }
  }


  return (
    <div className='flex items-center' >
        
        <Button disabled={isDisabled || isLoading} variant="ghost" className='hover:text-sky-500 cursor-pointer' onClick={handlePublish} >{isPublished ? "Unpublish" : "Publish"}</Button>
        <Button disabled={isLoading} className='hover:text-red-500 cursor-pointer' onClick={handleDelete} >
            <Trash />
        </Button>
         
    </div>
  )
}

export default Action