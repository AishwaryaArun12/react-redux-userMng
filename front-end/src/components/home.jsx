import React, { useEffect, useRef, useState } from 'react'
import Header from './header'
import { loginUserAsync, selectError, selectUser } from '../../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const home = () => {
    const user = useSelector(selectUser);
    const error = useSelector(selectError);
    const dispatch = useDispatch();
    const oldEmailRef = useRef();
    const newEmailRef = useRef();
    const oldPasswordRef = useRef();
    const newPasswordRef = useRef();
    const navigate = useNavigate();
    const [name,setName] = useState();
    const [designation,setDesignation] = useState();
    const [address,setAddress] = useState();
    const [mobile,setMobile] = useState();
    const [errors,setErrors] = useState()
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const imgRef = useRef();
    
    const openModal = () => {
        setIsEmailModalOpen(true);
      };
      const closeModal = () => {
        setIsEmailModalOpen(false);
      };
      const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
      };
      const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
      };
      const openProfileModal = () => {
        setIsProfileModalOpen(true);
      };
      const closeProfileModal = () => {
        setIsProfileModalOpen(false);
      };
   useEffect(()=>{
    console.log(user,'llllllllllll',localStorage.getItem('token'));
    if(localStorage.getItem('token') && !user){
        dispatch(loginUserAsync())
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;
        const data = {
            email,
            login : true,
        }
        
        dispatch(loginUserAsync(data));
        console.log(user,'sssssssssssssss');
        // setName(user.name);
        // setAddress(user.address);
        // setMobile(user.mobile);
        // setDesignation(user.designation);
    }else{
      navigate('/login')
    }
   
   },[])
   async function editEmail(){

    if(user.email != oldEmailRef.current.value){
        setErrors('Sorry, Email does not match current email')
    }else{
        setErrors('');
        let data = {
            oldEmail : oldEmailRef.current.value,
            newEmail : newEmailRef.current.value
            }
        await axios.put('https://usermng.onrender.com/editEmail',data);
       
        dispatch(loginUserAsync({email :newEmailRef.current.value,login :true}))
        closeModal();
    }
   }
   async function editPassword(){

    if(user.password != oldPasswordRef.current.value){
        setErrors('Sorry, Password does not match current password')
    }else{
        setErrors('');
        let data = {
            email : user.email,
            newPassword : newPasswordRef.current.value
            }
        await axios.put('https://usermng.onrender.com/editPassword',data);
        
        dispatch(loginUserAsync({email :user.email,login :true}))
        closePasswordModal();
    }
   }
   async function editProfile(){
    if(name.trim()== ''){
        setErrors('Sorry, name feild cannot be empty')
    }else{
        setErrors('');
        let data = {
            email : user.email,
            name ,
            mobile ,
            designation ,
            address
            }
        let result = await axios.put('https://usermng.onrender.com/editProfile',data);
        
        dispatch(loginUserAsync({email :user.email,login :true}))
        closeProfileModal();
    }
   }
   const imgEdit = ()=>{
    imgRef.current.click();
   }
   
   const handleFileChange =async (e)=>{
    const formData = new FormData();
    const file = e.target.files[0]
    formData.append('file', file);
    formData.append('email', user.email);
    let result = await axios.put('https://usermng.onrender.com/editProfilePic',formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    });
    
    dispatch(loginUserAsync({email :user.email,login :true}))
    
   }
  return (
    <>
    <div>
      <Header/>
      {user && <h2 className='m-3'>Welcome {user.name}</h2>}
     {user &&  <section style={{backgroundColor : '#eee'}}>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <img src={user.image == 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'? 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp':`http://localhost:3000/${user.image}`} alt="avatar"
              class="rounded-circle img-fluid" style={{width: "150px"}}/>
            <h5 class="my-3">{user.name}</h5>
            <p class="text-muted mb-1">{user.designation ? user.designation : 'Designation : Nil'}</p>
            <div class="d-flex justify-content-center mb-2">
              <button type="button" class="btn btn-primary" onClick={imgEdit}>Edit Profile IMG</button>

              <input  type="file"accept="image/*" style={{ display: 'none' }} ref={imgRef} onChange={handleFileChange}/>


              <button type="button" onClick={openProfileModal} class="btn btn-outline-primary ms-1">Edit Profile</button>
            
              {isProfileModalOpen && ( <>
                        <div className="modal-backdrop" style={{ opacity: 0.5, display: 'block' }}></div>
              <div className="modal" tabIndex="-1" style={{ display: 'block' }} >
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Profile</h1>
                        <button type="button" class="btn-close" onClick={closeProfileModal} ></button>
                    </div>
                    <div id="emailHelp" className="form-text text-danger">{errors}</div>
                    <div class="modal-body row">
                    <div class="mb-3 col-6 row">
                        <label htmlFor="exampleInputEmail1" class="form-label col-4">Name</label>
                        <input type="text" required class="form-control col-5" value={name}   onChange={(e)=>{setName(e.target.value)}} />
                        </div>
                        <div class="mb-3 col-6 row">
                        <label htmlFor="exampleInputEmail1" class="form-label col-6">Designation</label>
                        <input type="text" required class="form-control ms-2 col-5" value={designation}  onChange={(e)=>{setDesignation(e.target.value)}}  />
                        
                        </div>
                        <div class="mb-3 row col-6">
                        <label htmlFor="exampleInputPassword1" class="form-label col-6">Address</label>
                        <textarea type="text" required value={address} class="form-control col-5" onChange={(e)=>{setAddress(e.target.value)}} id="exampleInputPassword1" />
                        </div>
                        <div class="mb-3 row col-6">
                        <label htmlFor="exampleInputPassword1" class="form-label col-6">Mobile</label>
                        <input type="number" required value={mobile} class="form-control ms-2 col-5" onChange={(e)=>{setMobile(e.target.value)}} id="exampleInputPassword1" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onClick={()=>{editProfile()}} class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div></>)}
            
            </div>
          </div>
        </div>
    
      </div>
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Full Name</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{user.name}</p>
              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-6">
                <p class="text-muted mb-0">{user.email}</p>
              </div>
              <div class="col-sm-3">
              <button type="button" onClick={openModal}   class="btn btn-outline-primary ms-1">Edit Email</button>
              {isEmailModalOpen && ( <>
                        <div className="modal-backdrop" style={{ opacity: 0.5, display: 'block' }}></div>
              <div className="modal" tabIndex="-1" style={{ display: 'block' }} >
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Change Email</h1>
                        <button type="button" class="btn-close" onClick={closeModal} ></button>
                    </div>
                    <div class="modal-body">
                    <div class="mb-3">
                        <label htmlFor="exampleInputEmail1" class="form-label">Old Email address</label>
                        <input type="email" required class="form-control" id="exampleInputEmail1" ref={oldEmailRef} aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text text-danger">{errors}</div>
                        </div>
                        <div class="mb-3">
                        <label htmlFor="exampleInputPassword1" class="form-label">New Email Address</label>
                        <input type="email" required class="form-control" ref={newEmailRef} id="exampleInputPassword1" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onClick={()=>{editEmail()}} class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div></>)}

              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Password</p>
              </div>
              <div class="col-sm-6">
                <p class="text-muted mb-0">********</p>
              </div>
              <div class="col-sm-3">
              <button type="button" onClick={openPasswordModal} class="btn btn-outline-primary ms-1">Edit Password</button>
              {isPasswordModalOpen && ( <>
                        <div className="modal-backdrop" style={{ opacity: 0.5, display: 'block' }}></div>
              <div className="modal" tabIndex="-1" style={{ display: 'block' }} >
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Change Password</h1>
                        <button type="button" class="btn-close" onClick={closePasswordModal} ></button>
                    </div>
                    <div class="modal-body">
                    <div class="mb-3">
                        <label htmlFor="exampleInputEmail1" class="form-label">Old Password</label>
                        <input type="email" required class="form-control" id="exampleInputEmail1" ref={oldPasswordRef} aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text text-danger">{errors}</div>
                        </div>
                        <div class="mb-3">
                        <label htmlFor="exampleInputPassword1" class="form-label">New Password</label>
                        <input type="email" required class="form-control" ref={newPasswordRef} id="exampleInputPassword1" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onClick={()=>{editPassword()}} class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div></>)}
              
              
              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Mobile</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{user.mobile ? user.mobile : 'Nil'}</p>
              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Designation</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{user.designation ? user.designation : 'Nil'}</p>
              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Address</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{user.address ? user.address : 'Nil'}</p>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </div>
  
</section>}
    </div>
    </>
  )
}

export default home
