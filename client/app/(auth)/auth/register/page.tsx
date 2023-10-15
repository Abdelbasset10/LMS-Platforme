'use client'

import RegisterForm from "@/components/register/RegisterForm"
import Image from "next/image"
import { useEffect, useState } from "react"
import {useRouter} from 'next/navigation'
import { GoogleOAuthProvider } from "@react-oauth/google"


const RegisterPage = () => {
    const router= useRouter()

    const[isMounted,setIsMounted] = useState(true)

    const goToLogin = () => {
        router.push("/auth/login")
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
                <div className="flex-1 overflow-y-auto" >
                    <div className="w-11/12 sm:w-8/12 mx-auto flex flex-col xl:justify-center py-8 h-full" >
                        <Image src="/logo.svg" width={150} height={150} alt="logo image" />
                        <h1 className="text-lg sm:text-2xl md:text-xl  xl:text-3xl font-bold my-4" >Welcome to Logoipsum!, <br />Create Account</h1>
                        <p className="text-neutral-500 mb-4" >Fill the form below to create an account</p>
                        <RegisterForm />
                        <p className="my-2 text-neutral-500" >Already have account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={goToLogin} >Login</span></p>
                    </div>
                </div>

                <div className="hidden md:block md:flex-1 relative w-full h-screen" >
                    <Image src="/authbg3.jpg" fill alt="auth image" className="object-contain" />
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}

export default RegisterPage