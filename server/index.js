let express = require("express")
let { Server } = require("socket.io")
let bodyParser = require("body-parser") 
let cors = require("cors") 
let http = require("http")
require("dotenv").config() 
let app = express()
const server = http.createServer(app)
app.use(bodyParser.json())
app.use(cors())
// const mongoose = require('mongoose');
let PORT = process.env.PORT || 3031

const io = new Server(server, {cors:{
    origin:"http://localhost:5173",
    methods:["GET","DELETE","PUT","PATCH"]
}})

let rooms=[
    {
        _id:"31",   
        roomName: "AF103",
        roomPassword: "AF103",
        players: [],
        maxPlayer: 12,
        roles: {},
        settings: {},
        votes: {} ,
        isNight : false,
        isStart:false
        }
] 
app.get("/api",(req,res)=>{
    res.send("Mafia Game")
})
//Rooms CRUD

app.get("/api/rooms",(req,res)=>{
    if(rooms.length==0){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(rooms)
    }
})
app.get("/api/rooms/:id",(req,res)=>{
    let {id} = req.params
    let findedRoom = rooms.find((x)=>x._id==id)
    if(!findedRoom){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(findedRoom)
    }
})
app.delete("/api/rooms/:id",(req,res)=>{
    let {id} = req.params
    let findedRoom = rooms.filter((x)=>x._id!=id)
    if(!findedRoom){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(findedRoom)
    }
})
app.post("/api/rooms",(req,res)=>{
    let {roomName,roomPassword,maxPlayer,settings} = req.body
    let date = new Date()
    let id = date.getTime()
    let newData={
        id,
        players:[],
        roles:{},
        votes:{},
        isNight:false,
        isStart:false

    }
    if(roomName){
        newData.roomName=roomName
    }
    if(roomPassword){
        newData.roomPassword=roomPassword
    }
    if(maxPlayer){
        newData.maxPlayer=maxPlayer
    }
    if(settings){
        newData.settings=settings
    }else{
        newData.settings={}
    }
    rooms.push(newData)
    res.status(201).send(newData)
})
app.patch("/api/rooms/:id",(req,res)=>{

    let {roomName,roomPassword,players,maxPlayer,roles,settings,votes,isNight,isStart} = req.body
    let findedRoom = rooms.find((x)=>x._id==id)
    if(findedRoom){
        if(roomName){
            findedRoom.roomName=roomName
        }
        if(roomPassword){
            findedRoom.roomPassword=roomPassword
        }
        if(players){
            findedRoom.players=players
        }
        if(maxPlayer){
            findedRoom.maxPlayer=maxPlayer
        }
        if(roles){
            findedRoom.roles=roles
        }
        if(votes){
            findedRoom.votes=votes
        }
        if(isNight){
            findedRoom.isNight=isNight
        }
        if(isStart){
            findedRoom.isStart=isStart
        }
        if(settings){
            findedRoom.settings=settings
        }else{
            findedRoom.settings={}
        }
        rooms.push(newData)
        res.status(201).send(newData)
    }else{
        res.status(204).send("Data not found")
    }
})













server.listen(PORT,()=>{
    console.log("App listening on port: " + PORT);
})