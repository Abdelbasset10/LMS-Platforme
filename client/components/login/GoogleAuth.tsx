import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {
    isSubmiting : boolean
}

const GoogleAuth = ({isSubmiting} : Props) => {
    const router = useRouter()
    const [ user, setUser ] = useState<any>();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    
    useEffect(
        () => {
            if (user) {
                fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then(async (res : any) => {
                        const data = await res.json()
                        const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in/google`,{
                            credentials : "include",
                            method:"POST",
                            headers:{
                                "Content-Type": "application/json",
                                
                            },
                            body:JSON.stringify({
                                googleId:data.id,
                                email:data.email,
                                name:data.name,
                                picture:data.picture
                            })
                        })
                        const data2 = await res2.json()
                        if(data2.message && data2.message !=="Loged In successfully!"){
                            return toast.error(data2.message)
                        }
                        toast.success(data2.message)
                        router.push("/")
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );


  return (
    <Button disabled={isSubmiting} className="w-full border-[1px] border-sky-700 hover:bg-sky-600 hover:text-white rounded-[6px]" onClick={() => login()} >
        <Image src="/google.webp" width={30} height={30} alt="google image" />
        <p>Sign in with google</p>
    </Button>
  )
}

export default GoogleAuth