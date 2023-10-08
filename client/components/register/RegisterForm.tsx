'use client'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Mail, User, Lock} from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import GoogleAuth from "../login/GoogleAuth"


const formSchema = z.object({
    name: z.string().min(3,{
        message:"Name must be at least with 3 characters"
    }),
    email:z.string().min(2),
    password:z.string().min(3,{
        message:"Password must be at least with 3 characters"
    }),
    confirmPassword:z.string().min(1)
})

const RegisterForm = () => {
    const router = useRouter()
    const [isSignUp,setIsSignUp] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email:"",
            password:"",
            confirmPassword:""
        },
    })


    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if(values.password !== values.confirmPassword){
            return toast.error("passwords are not correct!")
        }
        setIsSignUp(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,{
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

            toast.success("Registred succefully!")
            router.push("/auth/login")

        } catch (error:any) {
            console.log(error)
            toast.error("Something wen wrong!")
        } finally {
            setIsSignUp(false)
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
                                            disabled={isSignUp}
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            placeholder="UserName" {...field} 
                                            disabled={isSignUp}
                                            className="focus:border-sky-700 focus:border-[2px] rounded-[6px] border-[1px] border-neutral-500 px-12" />
                                        <User className="absolute top-0 bottom-0 my-auto left-4"  />
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
                                            disabled={isSignUp}
                                            className="focus:border-sky-700 focus:border-[2px] rounded-[6px] border-[1px] border-neutral-500 px-12" />
                                        <Lock className="absolute top-0 bottom-0 my-auto left-4"  />
                                    </div>      
                                </FormControl>
                                <FormMessage />
                            </FormItem>       
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            placeholder="confirmPassword" {...field} 
                                            disabled={isSignUp}
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
                        disabled={isSignUp}
                        className="w-full bg-sky-600 rounded-[6px] text-white hover:bg-sky-700">
                            {isSignUp ? "Loading..." : "Register"}
                    </Button>
                </form>
            </Form>
            <div className="flex items-center justify-center my-4 gap-2" >
                <div className="w-20 h-[1px] bg-neutral-500" />
                    <p>OR</p>
                <div className="w-20 h-[1px] bg-neutral-500" />
            </div>
            <GoogleAuth isSubmiting={isSignUp} />
        </div>

    )
    }

export default RegisterForm