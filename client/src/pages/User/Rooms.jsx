import { useContext, useEffect, useState } from "react"
import { getAllRooms } from "../../services/api/roomRequests"
import { Skeleton, Input,  Row, Col } from 'antd';
import RoomCard from "../../components/RoomCard";
import MainContext from "../../services/contexts/MainContext";


function Rooms() {
  let {socket} = useContext(MainContext)
  let [roomsData,setRoomsData] = useState([])
  let [filteredRoomsData,setFilteredRoomsData] = useState([])
  let [isLoaded,setIsLoaded] = useState(false)

  

  useEffect(()=>{
    if(socket){
      socket.on("getRooms",(roomsData)=>{
        setRoomsData(roomsData)
        setFilteredRoomsData(roomsData)
        setIsLoaded(true)
      })
    }
  },[socket])
  useEffect(()=>{
    getAllRooms()
    .then((data)=>{
      setRoomsData(data)
      setFilteredRoomsData(data)
      setIsLoaded(true)
    })
  },[])

  return (
    <>
    <div className="container">
      <Input style={{width:"50%",margin:"10px 25%"}}  placeholder="Search Room" onChange={(e)=>{setFilteredRoomsData([...roomsData.filter((x)=>x.roomName.toLocaleLowerCase().includes(e.target.value.trim().toLocaleLowerCase()))])}} />
    </div>
    {isLoaded?(<>
      <div className="container">
        <Row  gutter={20}>
          {filteredRoomsData.map((roomData,idx)=>
          <Col key={idx} style={{marginTop:"30px"}} xs={24} sm={24}  md={12} xl={6} >
            <RoomCard roomData={roomData} />
          </Col>
          )}
        </Row>
      </div>
    </>):
    (<>
        <div className="container">
          <Row  gutter={20}>
            <Col style={{marginTop:"30px"}} xs={24} sm={24}  md={12} xl={6} >
              <Skeleton active />
            </Col>
            
            <Col style={{marginTop:"30px"}} xs={24} sm={24}  md={12} xl={6} >
              <Skeleton active />
            </Col>
            
            <Col style={{marginTop:"30px"}} xs={24} sm={24}  md={12} xl={6} >
              <Skeleton active />
            </Col>

            <Col style={{marginTop:"30px"}} xs={24} sm={24}  md={12} xl={6} >
              <Skeleton active />
            </Col>
          </Row>
        </div>
    </>)}

        
    </>
  )
}

export default Rooms
