
import { useState } from 'react'
import './App.css'
import axios from 'axios';
import { useEffect } from 'react';
import { FaTrash } from "react-icons/fa";  
import { MdDelete } from "react-icons/md";
import { BsTrash, BsTrashFill } from "react-icons/bs";
function App() {
  
const [addtask ,setAddTask] = useState("");
const [datas , setDatas] = useState([]);
const [length ,setLength] = useState(0);
const [search , setSearch] = useState([]);
const [loading , setLoading] = useState(true);
const getAllusers = async ()=>{
  await axios.get("https://todos-a47z.onrender.com/todos").then((res)=>{
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

  return (
    

    <div className="container">
       <h2>ToDo List</h2>
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
   
  )
}

export default App
