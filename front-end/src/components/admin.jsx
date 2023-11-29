import React, { useEffect, useState } from 'react'
import Header from './header'
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser,loginUserAsync } from '../../redux/userSlice'



const admin = () => {
    const [users,setUsers] = useState();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [search ,setSearch]= useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [name,setName] = useState('');
    const [address,setAddress] = useState('');
    const [mobile,setMobile] = useState('');
    const [designation,setDesignation] = useState('');
    const [errors,setErrors] = useState();
    const [email,setEmail] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [password,setPassword] = useState('');
    const openAddModal = () => {
        setIsAddModalOpen(true);
      };
      const closeAddModal = () => {
        setIsAddModalOpen(false);
      };
    const openProfileModal = (name,address,mobile,designation,email) => {
        setEmail(email);
        setName(name);
        setAddress(address);
        setMobile(mobile);
        setDesignation(designation);
        setIsProfileModalOpen(true);
      };
      const closeProfileModal = () => {
        setEmail();
        setName();
        setIsProfileModalOpen(false);
      };
      const addUser = async()=>{
        if(name.trim() == ''){
            setErrors('Sorry, Name can not be empty')
          }else if(password.trim() == ''){
            setErrors('Sorry, Password can not be empty')
          }
          const formData = {
            name ,
            email ,
            password 
          }
          try {
             await axios.post('https://usermng.onrender.com/register', formData, {
              headers: {
                'Content-Type': 'application/json',
              },

            });
            await getAllUsers();
             closeAddModal(); 
            
          } catch (error) {
            setErrors(error.response.data.error);
          }
          
      }
    useEffect(()=>{
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
        }
       },[])
    useEffect(()=>{
        axios.get('https://usermng.onrender.com/getUsers').then(data=>{
            setUsers(data.data.users);
        })
    },[])
    async function getAllUsers(){
       const users =await axios.get('https://usermng.onrender.com/getUsers')
        setUsers(users.data.users);
    }
    async function handleClick(id,active,i){
        
       if(active){
        const result = await axios.put(`https://usermng.onrender.com/blockUser/${id}`);
        setUsers(prev=>{prev[i].active = !active; return [...prev]});
       }else{
        const result = await axios.put(`https://usermng.onrender.com/activeUser/${id}`)
        setUsers(prev=>{prev[i].active = !active; return [...prev]});
       }
       
        }
        const editProfile = async()=>{
            if(name.trim()== ''){
                setErrors('Sorry, name feild cannot be empty')
            }else{
                setErrors('');
                let data = {
                    email,
                    name ,
                    mobile ,
                    designation ,
                    address
                    }
                await axios.put('https://usermng.onrender.com/editProfile',data);
                await getAllUsers()
                
                closeProfileModal();
            }
        }
  return (
    <div>
    <Header/>
      <div className='d-flex m-4'>
        <h2 className='me-auto'>User Management</h2>
        <input type="text" className='w-25' onChange={async(e)=>{setSearch(e.target.value); 
           await getAllUsers()
           setUsers((prev)=>{
           return prev.filter(i=>i.name.startsWith(e.target.value))   
        })}} value={search} placeholder='Search user here.....' />
        <button type='button' onClick={openAddModal} className='btn btn-outline-success'>Add user</button>
        {isAddModalOpen && ( <>
                        <div className="modal-backdrop" style={{ opacity: 0.5, display: 'block' }}></div>
              <div className="modal" tabIndex="-1" style={{ display: 'block' }} >
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add User</h1>
                        <button type="button" class="btn-close" onClick={closeAddModal} ></button>
                    </div>
                    <div id="emailHelp" className="form-text text-danger">{errors}</div>
                    <div class="modal-body row">
                    <div class="mb-3 col-6 row">
                        <label htmlFor="exampleInputEmail1" class="form-label col-4">Name</label>
                        <input type="text" required class="form-control col-5" value={name}   onChange={(e)=>{setName(e.target.value)}} />
                        </div>
                        <div class="mb-3 col-6 row">
                        <label htmlFor="exampleInputEmail1" class="form-label col-6">Email</label>
                        <input type="text" required class="form-control ms-2 col-5" value={email}  onChange={(e)=>{setEmail(e.target.value)}}  />
                        
                        </div>
                        <div class="mb-3 row col-6">
                        <label htmlFor="exampleInputPassword1" class="form-label col-6">Password</label>
                        <input type="text" required value={password} class="form-control col-5" onChange={(e)=>{setPassword(e.target.value)}} id="exampleInputPassword1" />
                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" onClick={()=>{
                            addUser()}} class="btn btn-primary">Save New User</button>
                    </div>
                    </div>
                </div>
                </div></>)}
      </div>
      <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Password</th>
      <th scope="col">Designation</th>
      <th scope="col">Address</th>
      <th scope="col">Mobile</th>
      <th scope='col'>Status</th>
      <th scope='col'></th>
      <th scope='col'></th>
    </tr>
  </thead>
  <tbody>

    {users?.[0] && users.map((i,index)=>{
        return( <tr>
      <th scope="row">{index}</th>
      <td><img src={i.image == 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'? 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp':`http://localhost:3000/${i.image}`} width={'90px'} height={'100px'} alt="" /></td>
      <td>{i.name}</td>
      <td>{i.email}</td>
      <td>{i.password}</td>
      <td>{i.designation ? i.designation : 'Nil'}</td>
      <td>{i.address ? i.address : 'Nil'}</td>
      <td>{i.mobile ? i.mobile : 'Nil'}</td>
      <td>{i.active ? 'Active' : 'Blocked'}</td>
      <td><button onClick={()=>{
        openProfileModal(i.name,i.address,i.mobile,i.designation,i.email)}} className='btn btn-outline-success'>Edit</button></td>
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
                        <button type="button" onClick={()=>{
                            editProfile(i.email)}} class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div></>)}
      <td><button onClick={()=>{handleClick(i._id,i.active,index)}} type='button' className={i.active ? 'btn btn-outline-danger' : 'btn btn-outline-success'}>{i.active ? 'Block' : 'Active'}</button></td>
    </tr>)
    })}
    
   
  </tbody>
</table>
    </div>
  )
}

export default admin
