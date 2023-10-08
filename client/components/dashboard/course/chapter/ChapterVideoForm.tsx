'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    video: z.string().min(1,{
        message:"Course image is required"
    }),
})

import { VideoIcon, Pencil } from 'lucide-react'


import MuxPlayer from '@mux/mux-player-react';

import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react"
import toast from "react-hot-toast"
import handleFetch from "@/helpers/handleFetch"
import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"
import Image from "next/image"


type Props = {
    video:string | null
    courseId:string
    chapterId : string
    playbackId:string | null | undefined
}

const ChapterVideoForm = ({video,courseId, chapterId, playbackId}:Props) => {
    const router = useRouter()
    const [isEditing,setIsEditing] = useState(false)

    const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            video: video || "",
        },
    })


    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const res : any = await handleFetch(`/chapter/update/${courseId}/${chapterId}`,"PATCH",values,refreshToken,accessToken)
            if(res?.message){
                return toast.error(res.message)
            }
            setIsEditing(false)
            router.refresh()
            
        } catch (error) {
            toast.error("Something went wrong!")
        } 
    }
    

    return (
        <div className='p-4 rounded-lg bg-slate-100' >
            <div className='flex items-center justify-between' >
                <p className='font-bold' >Chapter video</p>
                <div className='flex items-center gap-1 text-slate-700 hover:text-sky-500 cursor-pointer' onClick={()=>setIsEditing((prev)=>!prev)} >
                    <Pencil />
                    <p>Edit video</p>
                </div>
            </div>
            {isEditing ? (
                video ? (
                    <div>
                      <MuxPlayer
                        playbackId={playbackId!}
                        />;
                    </div>
                ) : (
                    <div className="mt-2 w-full" >
                        <UploadDropzone
                            endpoint="chapterVideo"
                            onClientUploadComplete={(res) => {
                                console.log(res)
                            handleSubmit({video:res?.[0].url!})
                            }}
                            onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                )
            ) : (
                video ? (
                    <div className="mt-2 w-full h-60 relative" >
                        <MuxPlayer
                        playbackId={playbackId!}
                        />;
                        <UploadButton
                            endpoint="chapterVideo"
                            onClientUploadComplete={(res) => {
                                console.log(res)
                            handleSubmit({video:res?.[0].url!})
                            }}
                            onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                ) : (
                    <p className="mt-2 italic" >No image</p>
                )
            )}
            
        </div>
    )
}

export default ChapterVideoForm