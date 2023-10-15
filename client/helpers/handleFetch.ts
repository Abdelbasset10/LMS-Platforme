
const handleFetch = async (url:string,method:string,content:any | undefined,refreshToken:any,accessToken:any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`,{
        credentials:"include",
        method,
        headers:{
            'Authorization': `Bearer ${accessToken}`,     
            "Content-Type": "application/json",  
        },
        body:JSON.stringify(content)
    })
    
    if(res.status === 403){
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh/generate`,{
            credentials: 'include',
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                refreshToken:refreshToken
            })
        })
        const data = await res.json()
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`,{
            method,
            headers:{
                'Authorization': `Bearer ${data}`,
                "Content-Type": "application/json",
            },
            body:JSON.stringify(content)
        })
        if(res2.status === 403){
            return ("/auth/login")
        }
        const data2 = await res2.json()
        return data2
    }

    const data = await res.json()
    return data
}

export default handleFetch