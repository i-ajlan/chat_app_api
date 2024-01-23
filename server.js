const { log } = require("console");
const exp = require("constants");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const app = express();
const cors = require('cors');
const { verify } = require("crypto");
const {supabase} = require('./config.js')
require('dotenv').config();


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({
  origin: ['https://i-ajlan.github.io', 'http://localhost:5173'],
  credentials: true
}))

const token_gen = (id, username)=>{return jwt.sign({id,username}, process.env.JWT_SECRET_KEY,{expiresIn:'5d'}) }

app.get('/',(req, res)=>{
  res.send('HEllo world')
})
app.post('/api/v1/register',async (req, res)=>{
  const {id, username}=req.body;
  
  try{
    const { data, error } = await supabase
  .from('user')
  .insert([
    { id, username },
  ])
  .select()  
  }catch(err){
        res.status(400).json({err})
          throw new Error (err.message);

  }
    token = token_gen(id, username)
    res.status(200).json({token})


})

app.post('/api/v1/login',async (req, res)=>{
  const {id, username}=req.body;
    
    let { data: user, error } = await supabase
  .from('user')
  .select("*")
  .eq('id', id).eq('username', username)

  if(error){
    console.log("wooooooy")
    console.log(error);
    throw new Error(error.message);
    res.status(400).json(error);
  }

  token = token_gen(id, username)
  res.status(200).json({token})
})

app.use((req, res, next)=>{
  const authHeader = req.headers.authorization
  if ((authHeader && !authHeader.startsWith('Bearer')))
   throw new Error("Authentication Error")
  const token = authHeader.split(' ')[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
  req.user ={id: payload.id} 
  console.log(payload.id);
  next()
}) 

app.get('/api/v1/contact',async (req,res)=>{
  const {id} = req.user 

  const {data, error} = await supabase.from('contacts').select('name_contact, contact_id').eq('user_id', id);

  if(error){
    console.log(error)
    res.status(401).json(err)
  }

  console.log(data);
  res.status(200).json(data)
})

app.post('/api/v1/contact', async (req,res)=>{
  const {name_contact, contact_id} = req.body
  const {id:user_id} = req.user 

  try {
    const {data, error} = await supabase.from('contacts').insert({user_id, name_contact, contact_id}).select();
    if(error){
      throw new Error(error.message)
    }
  } catch (error) {
     console.log("hello")
    console.log(error)
    // throw new Error(error.message)
    res.status(400).json(error)
  }

    res.status(200).json({ok:'ok'})

 
})


// app.use((err, req, res, next)=>{
//   res.status(400).json(err.message)
// })

const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin :['https://i-ajlan.github.io', 'http://localhost:5173']
  }
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(parseInt(id));
  console.log(typeof id)
  console.log("connected", id);
  socket.on('send-message',(message) => {
    const {sender, receiver, content} = message;
    console.log(message);
    // console.log(socket);
    socket.to(receiver).emit('receive-message',message)
  })
});

const port = process.env.PORT || 3000;

server.listen(port ,()=>{
    console.log('Server is working')
});