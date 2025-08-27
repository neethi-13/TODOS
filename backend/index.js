const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors  = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected Successfully");
}).catch((err)=>{
    console.error(err);
});

const registerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})
const user = mongoose.model("Registers" , registerSchema , "Registers");
app.post('/register' , async (req ,res)=>{
    const {name , email , password} = req.body;
    try {
      const us = await user.findOne({email:email});
      if(us){
        res.json({success:false , message:"User Already Registered"});
        return;
      }
      const newuser = new user({name , email , password});
      await newuser.save();
      res.json({success:true , message:"Registered Successfully"});
    } catch (error) {
      console.log(error);
      res.status(500).json({message:"Server Error"});
    }
})

app.post('/login' , async (req, res)=>{
    const {email , password} = req.body;
    try {
      const us = await user.findOne({email:email});
      if(us){
        if(us.password === password){
          res.json({success:true , message:"Login Successful"});
        }else{
          res.json({success:false , message:"Invalid Password"});
        }
      }else{
        res.json({success:false , message:"User Not Registered"});
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({success:false , message:"Server Error"})
    }
})


const TodoSchema = new mongoose.Schema({
   id: {
    type: Number,
    default: Date.now   
  },
  isDone: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  }
});

const todo = mongoose.model("Todoslist" , TodoSchema , "Todoslist");

app.post('/add', async(req ,res)=>{
    const {title} = req.body;
    

    try {
        console.log("Reached server");
        const to = await todo.findOne({title:title});
        if(to){
            return res.json({message:"Task is Already in List"});
        }
        const newtodo = new todo({title});
        await newtodo.save();
        res.json({success:true ,message:"Task Added Successfully"});
   } catch(error) {
        console.log(error);
        res.status(500).json({message:"Server Error"});
   }
});
app.get('/todos' , async (req,res)=>{
  try {
    const data  = await todo.find();
    if(!data || data.length === 0){
      res.json({message : "List is Empty"});
    }
    else{
      res.json(data);
    }
  } catch (error) {
    res.json(error);
  }
}) 

app.put('/done/:id' , async(req,res)=>{
  let id = Number(req.params.id);
  let todoDone = await todo.findOne({id:id});
  if(!todoDone){
    res.json({success : false});
  }
  todoDone.isDone = !todoDone.isDone;
  await todoDone.save();
  res.json({success : true});

  
})
app.delete("/delete/:id", async (req,res)=>{
  try {
    let id = Number(req.params.id);
    const deleteTodo = await todo.findOneAndDelete({id : id});
    if(!deleteTodo){
      res.json({success:false , message: "Task Not Found"});
      return
    }
    res.json({success : true  , message : "Task Deleted Successfully"});
  } catch (error) {
    res.json({success: false , message : error})
  }
})

const PORT = process.env.PORT;  // ✅ fallback
app.listen(PORT , ()=>{
    console.log("Server is running on port " + PORT);
});
