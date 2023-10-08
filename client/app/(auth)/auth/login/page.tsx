'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import {useRouter} from 'next/navigation'
import LoginForm from "@/components/login/loginForm"
import { Button } from "@/components/ui/button"
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from "@/components/login/GoogleAuth"




const LoginPage = () => {
    const router= useRouter()

    

    const[isMounted,setIsMounted] = useState(true)

    const goToRegister = () => {
        router.push("/auth/register")
    }


    useEffect(()=>{
        setIsMounted(false)
    },[])

    if(isMounted){
        return null
    }
    
    return (
        <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}`}>
            <div className="w-full h-screen flex " >
                <div className="flex-1" >
                    <div className="w-11/12 sm:w-8/12 mx-auto flex flex-col xl:justify-center py-8 h-full" >
                        <Image src="/logo.svg" width={150} height={150} alt="logo image" />
                        <h1 className="md:text-xl text-2xl xl:text-3xl font-bold my-4" >Good To<br />See you again!</h1>
                        <p className="text-neutral-500 mb-4" >Sign in to your account to continue </p>
                        <LoginForm />
                        <p className="my-2 text-neutral-500" >Don't have account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={goToRegister} >Register</span></p>
                    </div>
                </div>
                <div className="hidden md:block md:flex-1 relative w-full h-screen" >
                    <Image src="/authbg.avif" fill alt="auth image" className="object-cover" />
                    {/* <div className="absolute bottom-4 left-4 text-white z-05 ">
                        <p className="text-2xl" >Learn From Home!</p>
                        <p className="w-[70%]" >upgrade your skills in computer scince in your home by professional teachers and hight quality!</p>
                    </div> */}
                </div>
            </div>
        </GoogleOAuthProvider>
        
    )
}

export default LoginPage