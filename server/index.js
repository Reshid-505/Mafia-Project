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
let PORT = process.env.PORT

const io = new Server(server, {cors:{
    origin:["http://localhost:5173","http://192.168.1.8:5173"],
    // methods:["GET","DELETE","PUT","PATCH"]
}})

let rooms=[
    {
        _id:"31",   
        roomName: "Test",
        roomPassword: "test123",
        players: [],
        operator:"",
        maxPlayer: 12,
        roles: {},
        settings: {},
        votes: {} ,
        isNight : false,
        isStart:false
        }
] 
let players=[
    
]

io.on("connection",(socket)=>{
    console.log(`User id:${socket.id}`);

    socket.on("addRoom",(roomData)=>{
        let {roomName,roomPassword,maxPlayer,settings} = roomData
        let date = new Date()
        let id = String(date.getTime())
        let newData={
            _id:id,    
        }
        if(roomName){
            newData.roomName=roomName
        }
        if(roomPassword){
            newData.roomPassword=roomPassword
        }
        newData.players=[]
        newData.operator=socket.id
        if(maxPlayer){
            newData.maxPlayer=maxPlayer
        }
        newData.roles={}
        if(settings){
            newData.settings=settings
        }else{
            newData.settings={}
        }
        newData.votes={}
        newData.isNight=false
        newData.isStart=false
        rooms.push(newData)
        socket.join(id)
        socket.emit("roomID",id)
        socket.broadcast.emit("getRooms",rooms)
    })
    socket.on("setRoles",(roles)=>{
        if(rooms.find((x)=>x.operator===socket.id)){
            let room = rooms.find((x)=>x.operator===socket.id)
            room.roles=roles
            socket.broadcast.emit("getRooms",rooms)
            let rolesArr=[]
            for(const key in roles) {
                for(let i=0;i<roles[key];i++){
                    rolesArr.push(key)
                }
            }
            for(let i=0;i<room.players.length;i++){
                let random = Math.floor(Math.random() * rolesArr.length);
                let role=rolesArr.splice(random,1)
                players.find(x=>x._id==room.players[i]).role=role[0]
            }
            
            socket.broadcast.emit("getPlayers",players)
        }

    })
    socket.on("startGame",()=>{
        let room = rooms.find((x)=>x.operator===socket.id)
        if(room.roles.detective){
            room.isStart=true
            room.isNight=false
        }
        socket.broadcast.emit("getRooms",rooms)
    })

    socket.on("endGame",()=>{
        let room = rooms.find((x)=>x.operator===socket.id)
        for(let i = 0; i<room.players.length;i++){
            let player =players.find(x=>x._id===room.players[i])
            player.isProtected=false
            player.role=undefined
            player.killedBy = undefined
            player.isDead = false
        }
        room.isStart=false
        room.isNight=false
        socket.broadcast.emit("getRooms",rooms)
        socket.broadcast.emit("getPlayers",players)

    })

    socket.on("startNight",()=>{
        let room = rooms.find((x)=>x.operator===socket.id)
        if(room.roles.detective && room.isStart){
            room.isNight=true
        }
        socket.broadcast.emit("getRooms",rooms)
    })
    socket.on("endNight",()=>{
        let room = rooms.find((x)=>x.operator===socket.id)
        for(let i = 0; i<room.players.length;i++){
            let player =players.find(x=>x._id===room.players[i])
            player.isProtected=false
        }
        room.isNight=false
        socket.broadcast.emit("getRooms",rooms)
        socket.broadcast.emit("getPlayers",players)

    })
    socket.on("joinRoom", ({roomId,username}) => {
        if(!rooms.find(x=>x._id==roomId).players.includes(socket.id)){
            console.log(`${username} join room ${roomId}`);
            let newPlayer = {
                _id:socket.id,
                username,
                role:undefined,
                roomId,
                isDead:false,
                isProtected:false,
                killedBy:undefined,
            }
            players.push(newPlayer)
            socket.join(roomId);
            rooms.find((x)=>x._id===roomId).players.push(socket.id);
            socket.broadcast.emit("getPlayers", players);
            socket.broadcast.emit("getRooms", rooms);
        }else{
            console.log("this user already in room");
        }
    });
    socket.on("killPlayer",({id,killer})=>{
        let player = players.find(x=>x._id===id)
        if(killer=="admin"){
            player.isDead=true
            player.killedBy=killer
            socket.broadcast.emit("getPlayers", players);
        }else{
            if(!player.isProtected){
                player.isDead=true
                player.killedBy=killer
                socket.broadcast.emit("getPlayers", players);
            }
        }
    })
    socket.on("protectPlayer",({id,protecter})=>{
        let room = rooms.find((x)=>x.operator===socket.id)
        for(let i = 0; i<room.players.length;i++){
            players.find(x=>x._id===room.players[i]).isProtected=false
        }
        let player = players.find(x=>x._id===id)
        if(protecter=="admin"){
            player.isProtected=true
            socket.broadcast.emit("getPlayers", players);
        }
    })
    socket.on("disconnect",()=>{
        // if(rooms.find((x)=>x.operator===socket.id) && !rooms.find((x)=>x.operator===socket.id).players.length){
        if(rooms.find((x)=>x.operator===socket.id)){
            rooms=rooms.filter((x)=>x.operator!=socket.id)
            socket.broadcast.emit("getRooms",rooms)
        }else if(rooms.find((x)=>x.players.includes(socket.id))){
            players=players.filter(x=>x._id!=socket.id)
            rooms.find((x)=>x.players.includes(socket.id)).players=rooms.find((x)=>x.players.includes(socket.id)).players.filter((x)=>x!=socket.id)
            socket.broadcast.emit("getPlayers",players)
        }
        socket.broadcast.emit("getRooms", rooms);
        console.log(`User ID : ${socket.id} is disconnected`);
    })
    socket.on("exitRoom",()=>{
        // if(rooms.find((x)=>x.operator===socket.id) && !rooms.find((x)=>x.operator===socket.id).players.length){
        if(rooms.find((x)=>x.operator===socket.id)){
            rooms=rooms.filter((x)=>x.operator!=socket.id)
            socket.broadcast.emit("getRooms",rooms)
            socket.broadcast.emit("roomInfo",rooms.find((x)=>x.operator===socket.id))
        }else if(rooms.find((x)=>x.players.includes(socket.id))){
            players=players.filter(x=>x._id!=socket.id)
            rooms.find((x)=>x.players.includes(socket.id)).players=rooms.find((x)=>x.players.includes(socket.id)).players.filter((x)=>x!=socket.id)
            socket.broadcast.emit("roomInfo",rooms.find((x)=>x.players.includes(socket.id)))
            socket.broadcast.emit("getPlayers",players)
        }
        socket.broadcast.emit("getRooms", rooms);
        console.log(`User ID : ${socket.id} is exited`);
    })
})
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
        _id:id,
    }
    if(roomName){
        newData.roomName=roomName
    }
    if(roomPassword){
        newData.roomPassword=roomPassword
    }
    newData.players=[]
    newData.operator=""
    if(maxPlayer){
        newData.maxPlayer=maxPlayer
    }
    newData.roles={}
    if(settings){
        newData.settings=settings
    }else{
        newData.settings={}
    }
    newData.votes={}
    newData.isNight=false
    newData.isStart=false
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
        }
        res.status(201).send(findedRoom)
    }else{
        res.status(204).send("Data not found")
    }
})

//Players CRUD
app.get("/api/players",(req,res)=>{
    if(players.length==0){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(players)
    }
})
app.get("/api/players/:id",(req,res)=>{
    let {id} = req.params
    let findedPlayer = players.find((x)=>x._id==id)
    if(!findedPlayer){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(findedPlayer)
    }
})
app.delete("/api/players/:id",(req,res)=>{
    let {id} = req.params
    let findedPlayer = players.filter((x)=>x._id!=id)
    if(!findedPlayer){
        res.status(204).send("empty data")
    }else{
        res.status(200).send(findedPlayer)
    }
})
// app.post("/api/rooms",(req,res)=>{
//     let {roomName,roomPassword,maxPlayer,settings} = req.body
//     let date = new Date()
//     let id = date.getTime()
//     let newData={
//         _id:id,
//     }
//     if(roomName){
//         newData.roomName=roomName
//     }
//     if(roomPassword){
//         newData.roomPassword=roomPassword
//     }
//     newData.players=[]
//     newData.operator=""
//     if(maxPlayer){
//         newData.maxPlayer=maxPlayer
//     }
//     newData.roles={}
//     if(settings){
//         newData.settings=settings
//     }else{
//         newData.settings={}
//     }
//     newData.votes={}
//     newData.isNight=false
//     newData.isStart=false
//     rooms.push(newData)
//     res.status(201).send(newData)
// })
// app.patch("/api/rooms/:id",(req,res)=>{

//     let {roomName,roomPassword,players,maxPlayer,roles,settings,votes,isNight,isStart} = req.body
//     let findedRoom = rooms.find((x)=>x._id==id)
//     if(findedRoom){
//         if(roomName){
//             findedRoom.roomName=roomName
//         }
//         if(roomPassword){
//             findedRoom.roomPassword=roomPassword
//         }
//         if(players){
//             findedRoom.players=players
//         }
//         if(maxPlayer){
//             findedRoom.maxPlayer=maxPlayer
//         }
//         if(roles){
//             findedRoom.roles=roles
//         }
//         if(votes){
//             findedRoom.votes=votes
//         }
//         if(isNight){
//             findedRoom.isNight=isNight
//         }
//         if(isStart){
//             findedRoom.isStart=isStart
//         }
//         if(settings){
//             findedRoom.settings=settings
//         }
//         res.status(201).send(findedRoom)
//     }else{
//         res.status(204).send("Data not found")
//     }
// })













server.listen(PORT,()=>{
    console.log("App listening on port: " + PORT);
})