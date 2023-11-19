'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Mail, Lock} from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import GoogleAuth from "./GoogleAuth"


const formSchema = z.object({
    email:z.string().min(2),
    password:z.string().min(3,{
        message:"Password must be at least with 3 characters"
    }),
})

const LoginForm = () => {
    const router = useRouter()
    const [isSignIn,setIsSignIn] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email:"",
            password:"",
        },
    })


    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSignIn(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,{
                credentials : "include", // allows cookies and credentials to be included in the response
                method:"POST",
                headers:{
                    "Content-Type": "application/json",  
                },
                body:JSON.stringify(values)
            })
            const data = await res.json()
            if(data.message){
                return toast.error(data.message)
            }
            const res2 = await fetch("https://lms-platforme-abdelbasset10.vercel.app/api/store",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",  
                },
                body:JSON.stringify({
                    user:data.user,
                    refreshToken:data.refreshToken,
                    accessToken:data.accessToken
                })
            })
            const data2 = await res2.json()
            if(data2 !== "cookies setted succefully"){
                return toast.error("Something went wrong")
            }
            toast.success("Loged in succesfully!")
            router.push("/")
            
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        } finally {
            setIsSignIn(false)
        }
    }


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            placeholder="Email" {...field} 
                                            disabled={isSignIn}
                                            className="focus:border-sky-700 focus:border-[2px] rounded-[6px] border-[1px] border-neutral-500 px-12" />
                                        <Mail className="absolute top-0 bottom-0 my-auto left-4"  />
                                    </div>      
                                </FormControl>
                                <FormMessage />
                            </FormItem>       
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            placeholder="Password" {...field} 
                                            disabled={isSignIn}
                                            className="focus:border-sky-700 focus:border-[2px] rounded-[6px] border-[1px] border-neutral-500 px-12" />
                                        <Lock className="absolute top-0 bottom-0 my-auto left-4"  />
                                    </div>      
                                </FormControl>
                                <FormMessage />
                            </FormItem>       
                        )}
                    />
                    <Button 
                        type="submit" 
                        disabled={isSignIn}
                        className="w-full bg-sky-600 rounded-[6px] text-white hover:bg-sky-700" >Login</Button>
                </form>
            </Form>
            <div className="flex items-center justify-center my-4 gap-2" >
                <div className="w-20 h-[1px] bg-neutral-500" />
                    <p>OR</p>
                <div className="w-20 h-[1px] bg-neutral-500" />
            </div>
            <GoogleAuth isSubmiting={isSignIn} />
        </div>
    )
    }

export default LoginForm