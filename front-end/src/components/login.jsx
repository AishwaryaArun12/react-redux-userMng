import React, { useEffect, useRef, useState } from 'react'
import Header from './header'
import './App.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { loginUserAsync, selectError, selectLoading, selectUser } from '../../redux/userSlice';


const login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const user = useSelector(selectUser);
    const [errors,setErrors] = useState();
    useEffect(()=>{
       if(user){
        if(!user.active){
            setErrors('Sorry, You are restricted to login')
        }
        else if(!user.admin){
            setErrors('');
            navigate('/home');
        }else{
            navigate('/admin');
        }
       }
    },[user])
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const formData = {
            email : emailRef.current.value,
            password : passwordRef.current.value,
            login : false,
        }
        dispatch(loginUserAsync(formData))
    }
  return (
    <div>
      <Header />
     {!loading ?  <form onSubmit={handleSubmit} className='mx-auto p-4 mt-4 pt-4 border border-dark w-50'>
        <h3 className='m-4 text-center'>LOGIN</h3>
       { error && <h5 className='text-danger mb-3'>{error}</h5>}
       { errors && <h5 className='text-danger mb-3'>{errors}</h5>}
        <div class="mb-3">
          <label htmlFor="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" ref={emailRef} aria-describedby="emailHelp" />
          
        </div>
        <div class="mb-3">
          <label htmlFor="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" ref={passwordRef} id="exampleInputPassword1" />
        </div>
       
        <button type="submit" class="btn btn-primary">Submit</button>
      </form> : <h1>Loading...........</h1>}
    </div>
  )
}

export default login
