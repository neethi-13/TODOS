
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
const getAllusers = async ()=>{
  await axios.get("http://localhost:9000/todos").then((res)=>{
    if(res.data.message){
      //alert(res.data.message);
      setDatas("");
      setLength(0);
      return;
    }
    setDatas(res.data);
    setSearch(res.data)
    setLength(res.data.length);
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
  
  const res = await axios.post("http://localhost:9000/add" , {title : addtask});
  getAllusers();
  alert(res.data.message);
  if(res.data.success){
    setAddTask("");
  }
  //setAddTask(`Your Task ${addtask} Added Suceesfully `)

}

const handleDone = async (id) =>{
  try {
    const res = await axios.put(`http://localhost:9000/done/${id}`);
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
        const res = await axios.delete(`http://localhost:9000/delete/${id}`);
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

const handlesearch = (e)=>{
  
  const text = e.target.value.toUpperCase();
  const se = addtask.filter((task)=>
    task.title.toUpperCase().includes(text)
  );
  setSearch(se);
}

  return (
    <>
       <h2>ToDo List</h2>
        <div>
          <input type="text" placeholder='Enter Task'  value={addtask} onChange={(e)=>(setAddTask(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)))}/>
          <input type="search" name="" id="" onChange={handlesearch}/>
          <button onClick={AddTasks}>Add task</button>
        </div>
        <div>
          
          <table>
            <tbody>
              {datas && datas.map((data,index)=>{
                return(
                  <tr key={data.id}>
                    <td>{index +1}</td>
                    <td><input type="checkbox" name="" id="" checked={data.isDone} onChange={()=>{handleDone(data.id)}}/></td>
                    <td>{data.title}</td>
                    <td><button onClick={()=>{deletetask(data.title ,data.id )}}>{((index+1)%2 ===0 )? <BsTrash />:<BsTrashFill /> }</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          
          
          {length  ? `Just ${length} More to Go 🎯` : "List is Empty"  }
          
        </div>
    </>
  )
}

export default App
