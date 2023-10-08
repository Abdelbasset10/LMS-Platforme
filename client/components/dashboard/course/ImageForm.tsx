'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    image: z.string().min(1,{
        message:"Course image is required"
    }),
})

import { ImageIcon, Pencil } from 'lucide-react'


 
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react"
import toast from "react-hot-toast"
import handleFetch from "@/helpers/handleFetch"
import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"
import Image from "next/image"


type Props = {
    image:string | null
    courseId:string
}

const DescriptionForm = ({image,courseId}:Props) => {
    const router = useRouter()
    const [isEditing,setIsEditing] = useState(false)

    const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: image || "",
        },
    })


    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const res = await handleFetch(`/course/${courseId}`,"PATCH",values,refreshToken,accessToken)
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
                <p className='font-bold' >Course image</p>
                <div className='flex items-center gap-1 text-slate-700 hover:text-sky-500 cursor-pointer' onClick={()=>setIsEditing((prev)=>!prev)} >
                    <Pencil />
                    <p>Edit image</p>
                </div>
            </div>
            {isEditing ? (
                image ? (
                    <div>
                      <div className="my-2 w-full h-60 relative" >
                        <Image src={image} fill alt="course image" />
                      </div>
                      <UploadButton
                            endpoint="courseImage"
                            onClientUploadComplete={(res) => {
                                handleSubmit({image:res?.[0].url!})
                            }}
                            onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                ) : (
                    <div className="mt-2 w-full" >
                        <UploadDropzone
                            endpoint="courseImage"
                            onClientUploadComplete={(res) => {
                            handleSubmit({image:res?.[0].url!})
                            }}
                            onUploadError={(error: Error) => {
                            // Do something with the error.
                            alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                )
            ) : (
                image ? (
                  <div className="mt-2 w-full h-60 relative" >
                    <Image src={image} fill alt="course image" />
                  </div>
                ) : (
                  <p className="mt-2 italic" >No image</p>
                )
            )}
            
        </div>
    )
}

export default DescriptionForm