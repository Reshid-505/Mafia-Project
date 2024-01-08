import axios from "axios";
import { BASE_URL } from "./BASE_URL";

export async function getAllPlayers(){
    let result;
    await axios(BASE_URL+"/players")
    .then(res=>{result=res.data})
    return result
}
export async function getByIdPlayer(id){
    let result;
    await axios(BASE_URL+"/players/"+id)
    .then(res=>{result=res.data})
    return result
}
export async function addPlayer(data){
    let result;
    await axios.post(BASE_URL+"/players",data)
    .then(res=>{result=res.data})
    return result
}
export async function editPlayer(id,data){
    let result;
    await axios.patch(BASE_URL+"/players/"+id,data)
    .then(res=>{result=res.data})
    return result
}