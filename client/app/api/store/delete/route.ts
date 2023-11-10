import { cookies } from 'next/headers'

import { NextRequest, NextResponse } from "next/server"

export const POST = async (req:NextRequest) => {
    try {
        cookies().delete("user")
        cookies().delete("refreshToken")
        cookies().delete("acessToken")
        return new NextResponse(JSON.stringify("cookies has been deleted"))
    } catch (error : any) {
        console.log(error)
        return new NextResponse(JSON.stringify({message:error.message}),{status:500})
    }
}