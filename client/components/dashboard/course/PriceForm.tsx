'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'

const formSchema = z.object({
    price: z.string().min(1,{
        message:"Course price is required"
    }),
})

import { Pencil } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import toast from "react-hot-toast"
import handleFetch from "@/helpers/handleFetch"
import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"


type Props = {
    price:string | null
    courseId:string
}

const PriceForm = ({price,courseId}:Props) => {
    const router = useRouter()
    const [isEditing,setIsEditing] = useState(false)

    const {refreshToken,accessToken} = useAppSelector((state)=>state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: price || "",
        },
    })

    const {isSubmitting} = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
        <div className='p-4 rounded-lg bg-slate-100 h-fit' >
            <div className='flex items-center justify-between' >
                <p className='font-bold' >Course price</p>
                <div className='flex items-center gap-1 text-slate-700 hover:text-sky-500 cursor-pointer' onClick={()=>setIsEditing((prev)=>!prev)} >
                    <Pencil />
                    <p>Edit price</p>
                </div>
            </div>
            {isEditing ? (
                <Form {...form}  >
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 mt-2">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="e.g: '$10'" {...field} 
                                        className="bg-white border-white border rounded-lg"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button disabled={isSubmitting} type="submit" className="bg-sky-500 rounded-[6px] text-white hover:bg-sky-600" >Save</Button>
                    </form>
                </Form>
            ) : (
                price ? (
                    <p className="mt-2" >${price}</p>
                ) : (
                    <p className="mt-2 italic text-sm" > No price</p>
                )
            )}
            
        </div>
    )
}

export default PriceForm