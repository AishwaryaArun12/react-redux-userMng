import React, { useRef, useState } from 'react'
import Header from './header'
import './App.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const signup = () => {
  const nameRef =useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error,setError] = useState();
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(nameRef.current.value.trim() == ''){
      setError('Sorry, Name can not be empty')
    }else if(passwordRef.current.value.trim() == ''){
      setError('Sorry, Password can not be empty')
    }
    const formData = {
      name : nameRef.current.value,
      email : emailRef.current.value,
      password : passwordRef.current.value
    }
    try {
       await axios.post('https://usermng.onrender.com/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
        navigate('/login')
      
    } catch (error) {
      setError(error.response.data.error);
    }
    
    
  }
  return (
    <div>
      <Header />
      <form method='POST' onSubmit={handleSubmit} action='https://usermng.onrender.com/register' className='mx-auto p-4 mt-4 pt-4 border border-dark w-50'>

        <h3 className='m-4 text-center'>SIGNUP</h3>
        { error && <h5 className='text-danger mb-3'>{error}</h5>}
        <div class="mb-3">
          <label htmlFor="name" class="form-label">Username</label>
          <input type="text" className="form-control" required name='name' id="name" ref={nameRef}/>
        </div>
        <div class="mb-3">
          <label htmlFor="email" class="form-label">Email address</label>
          <input type="email" name='email' required class="form-control" ref={emailRef} id="email" aria-describedby="emailHelp" />
        </div>
        <div class="mb-3">
          <label htmlFor="password" class="form-label">Password</label>
          <input type="password" required name='password' class="form-control" id="password" ref={passwordRef} />
        </div>
       
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default signup
