import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';


const initialState = {
    loading : false,
    user : null,
    error : null
}
export const loginUserAsync = createAsyncThunk('user/login', async(credential)=>{
    const result = await axios.post('https://usermng.onrender.com/login',credential);
            const {token,user,admin} = result.data;
            localStorage.setItem('token', token);          
           return {...user,admin:admin};
       
})
const userSlice = createSlice({
    name : 'user',
    initialState : initialState,
    reducers : {
        clearUser : (state)=> {
            state.user = null;
            state.error = null;
        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(loginUserAsync.pending, (state)=>{
            state.loading = true;

        })
        .addCase(loginUserAsync.fulfilled, (state,action)=>{
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(loginUserAsync.rejected, (state,action)=>{
            state.loading = false;
            state.user = null;
            console.log(action);
            state.error = action.payload?.error || 'Sorry, Password or Email does not match any user';
        })
    }
})


export const {clearUser} = userSlice.actions;
export const selectLoading = (state)=>state.user.loading;
export const selectUser = (state)=>state.user.user;
export const selectError = (state)=>state.user.error;
export default userSlice.reducer;