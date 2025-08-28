
import { useState } from 'react'
import './App.css'
import axios from 'axios';
import { useEffect } from 'react';
// import { FaTrash } from "react-icons/fa";  
// import { MdDelete } from "react-icons/md";
import { BsTrash, BsTrashFill } from "react-icons/bs";
function App() {
  
const [addtask ,setAddTask] = useState("");
const [datas , setDatas] = useState([]);
const [length ,setLength] = useState(0);
const [search , setSearch] = useState([]);
const [loading , setLoading] = useState(true);
const [login, setLogin] = useState(true);
const [register, setRegister] = useState(false);
const [name,setName] = useState("");
const [email, setEmail] = useState("");

const [forget , setFroget] = useState(true);
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");

const getAllusers = async ()=>{
  await axios.get("https://todos-a47z.onrender.com/todos").then((res)=>{
    setLoading(true);
    if(res.data.message){
      //alert(res.data.message);
      setDatas("");
      setLength(0);
      setLoading(false);
      return;
    }
    setDatas(res.data);
    setSearch(res.data)
    setLength(res.data.length);
    setLoading(false);
  });
} 
useEffect(()=>{
getAllusers();
},[])



const AddTasks = async ()=>{
  //console.log(addtask);
  if(!addtask){
    alert("Enter Your Task");
      return;
    
  }
  
  const res = await axios.post("https://todos-a47z.onrender.com/add" , {title : addtask});
  getAllusers();
  alert(res.data.message);
  if(res.data.success){
    setAddTask("");
  }
  //setAddTask(`Your Task ${addtask} Added Suceesfully `)

}

const handleDone = async (id) =>{
  try {
    const res = await axios.put(`https://todos-a47z.onrender.com/done/${id}`);
    if(res.data.success){
      setDatas( data => data.map( to => to.id === id ? {...to , isDone : !to.isDone}: to));
    }
    getAllusers();
  } catch (error) {
    console.error(error);

  }
}

const deletetask = async (title ,id)=>{
  try{
    const isdelete = window.confirm(`You wamt to delete the Task ${title}`);
    if(isdelete){
        const res = await axios.delete(`https://todos-a47z.onrender.com/delete/${id}`);
        if(res.data.success){
          alert(res.data.message);
          
          getAllusers();
        }else{
          alert(res.data.message);
        }
    }
  }catch(err){
    console.log(err)
  }
}

const Addandesearch = (e)=>{
  setAddTask(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
  const text = e.target.value.toUpperCase();
  const se = datas.filter((task)=>
    task.title.toUpperCase().includes(text)
  );
  setSearch(se);
}
const Registers = async (e)=>{
  e.preventDefault();
  try {
    if(password !== confirm){
      alert("Password and Confirm Password are not same");
      return;
    }
    const res = await axios.post("https://todos-a47z.onrender.com/register" , {name:name,email:email,password:password});
    if(res.data.success){
      alert(res.data.message);
      setLogin(true);
      setRegister(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    }
    else{
      alert(res.data.message);
    }
  } catch (error) {
    console.log(error);
  }
}

const Logins = async (e)=>{
  e.preventDefault();
  try {
    const res = await axios.post("https://todos-a47z.onrender.com/login" , {email:email,password:password});
    if(res.data.success){
      alert(res.data.message);
      setLogin(false);
      
      setPassword("");
      getAllusers();
      
    }
    else{
      alert(res.data.message);
    }
  } catch (error) {
    console.log(error);
  }
}
const Frogetpass = async (e) =>{
  e.preventDefault();
}
  return (
    

    <>
    {login && forget && 
      <div className='containers'> 
      <div className='nav'>
      <h2>Login Page </h2>
      </div>
    <form onSubmit={Logins}>
      {/* <label for="name">Name:</label>
      <input type="text" id="name" name="name" required/>
      <br /> <br /> */}
      <h2>Login</h2> <br />
      <label htmlFor="email">Email:</label>
      <input type="text" id="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
      <br /> <br />
      <label htmlFor="password" >Password:</label>
      <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      <br></br> <br /> 
      <div className="log-btn">
        <button type="submit" className='btn green'>Login</button>
        {login && <button className='btn red' onClick={()=>setFroget(!forget)}>{forget?"Froget Password":"go to Login Page"}</button> }
      </div> <br /> you don't have account ?
      {forget && (login || register) && <button className='delete-btn' type="button" onClick={()=>(setLogin(!login) , setRegister(!register))}> Register</button>}
    </form></div>

    }
    { !login && forget && register &&
      <div className='containers'> 
      <div className='nav'>
       <h2>Registeration Page </h2>
      </div>
    <form onSubmit={Registers}>
      <h2>Register</h2>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required/>
      <br /> <br />
      <label htmlFor="email">Email:</label>
      <input type="text" id="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
      <br /> <br />
      <label htmlFor="password" >Password:</label>
      <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      <br></br> <br /> 
      <label htmlFor="confirm_password">Confirm Password:</label>
      <input type="password" id="confirm_password" name="confirm_password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required/>  
      <br></br> <br />
      <div className="log-btn">
      <button type="submit" className='btn green'>Register</button>
      </div>
       you have account ?
      {forget && (login || register) && <button className='delete-btn' type="button" onClick={()=>(setLogin(!login) , setRegister(!register))}>Login</button>}
    </form>
    
    </div>
    }

    
    {!forget &&
    <div className='containers'> 
    <div className='nav'>
    <h2>Change Password</h2>
   
    </div>
    <form onSubmit={Frogetpass}>
      <h2>Change Password</h2>
    <label htmlFor="email">Email:</label>
      <input type="text" id="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
      <br /> <br />
      <label htmlFor="password" >Password:</label>
      <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      <br></br> <br /> 
      <div className="log-btn">
      <button className='btn green' type="submit">Change Password</button>
      {login && <button className='btn red' onClick={()=>setFroget(!forget)}>{forget?"Froget Password":"go to Login Page"}</button> }</div>
    </form>
    </div>
    }
    

    {!login && !register &&
    <div className="container">
      <div className="nav-main">
        <h2>ToDo List</h2>
        <h2>{email}</h2>
      </div>
      
       
        <div className="input-search">
          <input type="text" placeholder='Enter Task or search Task'  value={addtask} onChange={Addandesearch}/>
          
          <button onClick={AddTasks} className='btn green'>Add Task</button>
        </div>
        {loading && <h2 className='load'>Loading...</h2> }
          
          <table className='table'>
            <thead>
          <tr>
            <th>S.No</th>
            <th>Done</th>
            <th>Task</th>
            
            
            <th>Delete</th>
          </tr>
        </thead>
            <tbody>
              {datas && search.map((data,index)=>{
                return(
                  <tr key={data.id}>
                    <td>{index +1}</td>
                    <td><input type="checkbox"  className='checked' name="" id="" checked={data.isDone} onChange={()=>{handleDone(data.id)}}/></td>
                    <td>{data.title}</td>
                    <td><button className='delete-btn' onClick={()=>{deletetask(data.title ,data.id )}}>{((index+1)%2 ===0 )? <BsTrash />:<BsTrashFill /> }</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          
          
          <div className="length">
           <h2>{length  ? `Just ${length} More to Go 🎯` : "List is Empty"  }</h2> 
          
          </div>
       
        </div>
    }
    </>
   
  )
}

export default App
