import { cookies } from 'next/headers'

import { NextRequest, NextResponse } from "next/server"

export const POST = async (req:NextRequest) => {
    try {
        const {user,refreshToken,accessToken} = await req.json()
        cookies().set('user', JSON.stringify(user), { maxAge: 1000 * 60 * 60 * 24 })
        cookies().set('refreshToken', JSON.stringify(refreshToken), { maxAge: 1000 * 60 * 60 * 24 })
        cookies().set('accessToken', JSON.stringify(accessToken), { maxAge: 1000 * 60 * 15 })
        return new NextResponse(JSON.stringify("cookies setted succefully"))
    } catch (error : any) {
        console.log(error)
        return new NextResponse(JSON.stringify({message:error.message}),{status:500})
    }

}