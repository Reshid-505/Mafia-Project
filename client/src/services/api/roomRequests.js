import axios from "axios";
import { BASE_URL } from "./BASE_URL";

export async function getAllRooms(){
    let result;
    await axios(BASE_URL+"/rooms")
    .then(res=>{result=res.data})
    return result
}
export async function getByIdRoom(id){
    let result;
    await axios(BASE_URL+"/rooms/"+id)
    .then(res=>{result=res.data})
    return result
}
export async function addRoom(data){
    let result;
    await axios.post(BASE_URL+"/rooms",data)
    .then(res=>{result=res.data})
    return result
}
export async function editRoom(id,data){
    let result;
    await axios.patch(BASE_URL+"/rooms/"+id,data)
    .then(res=>{result=res.data})
    return result
}