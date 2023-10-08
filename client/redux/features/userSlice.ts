import {createSlice} from '@reduxjs/toolkit'


interface StateTypes {
    user:any,
    refreshToken:any,
    accessToken:any
}

const initialState : StateTypes = {
    user : null,
    refreshToken:null,
    accessToken:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserInfo : (state, action) => {
            state.user = action.payload.user
            state.refreshToken = action.payload.refreshToken
            state.accessToken = action.payload.accessToken
        },
        clearUserInfo : (state) => {
            state.user = null
            state.refreshToken = null
            state.accessToken = null
        }
    }
})

export const {setUserInfo, clearUserInfo} = userSlice.actions

export default userSlice.reducer