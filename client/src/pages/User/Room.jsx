import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getByIdRoom } from "../../services/api/roomRequests"
import { useNavigate } from "react-router-dom"
import MainContext from "../../services/contexts/MainContext"
import { getAllPlayers, getByIdPlayer } from "../../services/api/playerRequests"
import { Button, List, Modal, Checkbox, Select, Form } from "antd"

function Room() {
  const { Option } = Select;
  const {id} = useParams()
  let{ socket } = useContext(MainContext)
  let [roomData,setRoomData] = useState({})
  let [playerData,setPlayerData] = useState({})
  let [allPlayerData,setAllPlayerData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    // detective: true,police:false,doctor:false,lover:false,homeless:false,kamikaze:false,civil:1,mafia:1
    let counter=Number(values.detective)+Number(values.police)+Number(values.doctor)+Number(values.lover)+Number(values.homeless)+Number(values.kamikaze)+values.civil+values.mafia
    if(counter==roomData?.players.length){
      let roles={
        detective: Number(values.detective),
        police:Number(values.police),
        doctor:Number(values.doctor),
        lover:Number(values.lover),
        homeless:Number(values.homeless),
        kamikaze:Number(values.kamikaze),
        civil:values.civil,
        mafia:values.mafia
      }
      console.log(roles);
      socket.emit("setRoles",roles);
      getByIdRoom(id)
      .then((data)=>{
        if(data){
          setRoomData(data)
        }else{
          navigate("/");
        }
      })
      getAllPlayers()
      .then(data=>{
        setAllPlayerData(data)
      })
      setIsModalOpen(false)
      
    }else{
      alert(counter+"/"+roomData?.players.length);
    }
    
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
    if(socket){
      if(roomData?.players?.includes(socket.id)){
        socket.on("getPlayers",(data)=>{
          if(data){
            setAllPlayerData(data)
          }
        })
        socket.on("getRooms",(rooms)=>{
          let thisRoom = rooms.find(x=>x.players.includes(socket.id))
          if(thisRoom){
            setRoomData(thisRoom)
          }else{
            // navigate("/");
          }
        })
        socket.on("getPlayers",(datas)=>{
            if(datas.find(x=>x._id==socket.id)){
              setPlayerData(datas.find(x=>x._id===socket.id))
            }else{
              // navigate("/");
            }
        })

      }
      if(roomData?.operator===socket?.id){
        socket.on("getRooms",(data)=>{
          let thisRoom = data.find(x=>x.operator===socket.id)
          if(thisRoom){
            setRoomData(thisRoom)
          }else{
            // navigate("/");
          }
        })
        socket.on("getPlayers",(data)=>{
          console.log("players");
          if(data){
            setAllPlayerData(data)
          }
        })
      }
    }
  // }, [socket]);
  console.log(allPlayerData);
  const navigate = useNavigate()
  useEffect(()=>{
    getByIdRoom(id)
    .then((data)=>{
      if(data){
        setRoomData(data)
        if(data?.players?.includes(socket.id)){
          getByIdPlayer(socket.id)
          .then((data)=>{
            if(data){
              // console.log(data);
              setPlayerData(data)
            }else{
              // navigate("/");
            }
          })
        }
      }else{
        navigate("/");
      }
    })
    getAllPlayers()
    .then(data=>{
      setAllPlayerData(data)
    })

  },[])
  function handleKill(id){
    if(roomData?.operator===socket?.id){
      socket.emit("killPlayer",{id:id,killer:"admin"})
    }else if(playerData.role=="mafia"||playerData.role=="don"){
      socket.emit("killPlayer",{id:id,killer:playerData.role})
    }
    getAllPlayers()
    .then(data=>{
      setAllPlayerData(data)
    })
  }
  function handleProtect(id){
    if(roomData?.operator===socket?.id){
      socket.emit("protectPlayer",{id:id,protecter:"admin"})
    }else if(playerData.role=="doctor"){
      socket.emit("protectPlayer",{id:id,protecter:"admin"})
    }
    getAllPlayers()
    .then(data=>{
      setAllPlayerData(data)
    })
  }
  function handleStartGame(){
    socket.emit("startGame")

    getByIdRoom(id)
    .then((data)=>{
      if(data){
        setRoomData(data)
      }else{
        navigate("/");
      }
    })
    
  }
  function handleEndGame(){
    socket.emit("endGame")

    getByIdRoom(id)
    .then((data)=>{
      if(data){
        setRoomData(data)
      }else{
        navigate("/");
      }
    })
    getAllPlayers()
    .then(data=>{
      setAllPlayerData(data)
    })
    
  }
  function handleStartNight(){
    socket.emit("startNight")
    
    getByIdRoom(id)
    .then((data)=>{
      if(data){
        setRoomData(data)
      }else{
        navigate("/");
      }
    })
  }
  function handleEndNight(){
    socket.emit("endNight")

    getByIdRoom(id)
    .then((data)=>{
      if(data){
        setRoomData(data)
      }else{
        navigate("/");
      }
    })
    getAllPlayers()
    .then(data=>{
      setAllPlayerData(data)
    })
  }
  return (
    <>
    <div className="container">
      
      <h1>
        Room Name: {roomData?.roomName} 
      </h1>
      {roomData?.isStart?"Game Start":"Game Not Started"} <br />
      {roomData?.isStart && <>{(roomData?.isNight?"Night":"Morning")}<br /></>}
      {(roomData?.operator===socket?.id && !roomData?.isStart) &&
      <Button type="primary" onClick={showModal}>Set Roles</Button>
      }
      <h2>{roomData?.operator!==socket?.id && (playerData?.isDead?"Dead":"Alive")}</h2>
      <h2>
        {roomData?.operator===socket?.id ? "Operator":playerData.username+": "+(playerData.role?playerData.role:"role not setted")}
      </h2>
      <h3>Players in room: {roomData?.players?.length}/{roomData?.maxPlayer}</h3>
      {roomData?.operator===socket?.id &&
        <h3>
          Room ID : {id}
      </h3>}
      {roomData?.operator===socket?.id &&
        <Button onClick={()=>{roomData?.isStart?handleEndGame():handleStartGame()}} style={{margin:"10px 0"}} type="primary" danger={roomData?.isStart?true:false} >
          {roomData?.isStart?"End Game":"Start Game"}
      </Button>}
      <br />
      {(roomData?.operator===socket?.id && roomData?.isStart) &&
        <Button onClick={()=>{roomData?.isNight?handleEndNight():handleStartNight()}} style={{margin:"10px 0"}} type="primary" danger={roomData?.isNight?true:false} >
          {roomData?.isNight?"End Night":"Start Night"}
      </Button>}
      {(roomData?.operator===socket?.id || (roomData?.players.includes(socket?.id) && !roomData?.isNight)) &&
      <List
      size="small"
      bordered
      dataSource={roomData?.players}
      renderItem={(playerId)=>{
        let playerData=allPlayerData?.length? allPlayerData?.find(x=>x._id===playerId):{}
        return(<List.Item> {playerData?.username} | {playerData?.isDead?"Dead":"Alive"} | {roomData?.operator===socket?.id? playerData?.role?playerData?.role:"role not setted ":""}{(roomData?.operator===socket?.id && roomData?.isStart && roomData?.isNight ) &&  <><Button type="primary" onClick={()=>{handleKill(playerData?._id)}} disabled={playerData?.isDead || playerData?.isProtected ?"disabled":false} danger>Kill</Button> <Button type="primary" onClick={()=>{handleProtect(playerData?._id)}} disabled={playerData?.isProtected || playerData?.isDead ?"disabled":false} >Protect</Button></>} </List.Item>)
      }}
      />
      }
    </div>
    <Modal destroyOnClose={true} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
    <Form
                name="basic"
                labelCol={{
                span: 6,
                }}
                wrapperCol={{
                span: 16,
                }}
                style={{
                maxWidth: 600,
                margin:"100px 0"
                }}
                initialValues={{ detective: true,police:false,doctor:false,lover:false,homeless:false,kamikaze:false,civil:1,mafia:1 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                  <Form.Item
                  name="detective"
                  // valuePropName="checked"
                  wrapperCol={{
                    offset: 3,
                    span: 16,
                  }}
                >
                  <Checkbox readonly checked>Detective</Checkbox>
                </Form.Item>

                <Form.Item
                name="police"
                valuePropName="checked"
                wrapperCol={{
                  offset: 3,
                  span: 16,
                }}
                >
                  <Checkbox>Police</Checkbox>
                </Form.Item>

                <Form.Item
                name="doctor"
                valuePropName="checked"
                wrapperCol={{
                  offset: 3,
                  span: 16,
                }}
                >
                  <Checkbox>Doctor</Checkbox>
                </Form.Item>

                <Form.Item
                name="lover"
                valuePropName="checked"
                wrapperCol={{
                  offset: 3,
                  span: 16,
                }}
                >
                  <Checkbox>Lover</Checkbox>
                </Form.Item>

                <Form.Item
                name="homeless"
                valuePropName="checked"
                wrapperCol={{
                  offset: 3,
                  span: 16,
                }}
                >
                  <Checkbox>Homeless</Checkbox>
                </Form.Item>

                <Form.Item
                name="kamikaze"
                valuePropName="checked"
                wrapperCol={{
                  offset: 3,
                  span: 16,
                }}
                >
                  <Checkbox>Kamikaze</Checkbox>
                </Form.Item>

                <Form.Item name="mafia" label="Mafia">
                    <Select
                    placeholder="Select a mafia player"
                    defaultValue={1}
                    >
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="civil" label="Civil">
                    <Select
                    placeholder="Select a civil player"
                    defaultValue={1}
                    >
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                    <Option value={11}>11</Option>
                    <Option value={12}>12</Option>
                    <Option value={13}>13</Option>
                    <Option value={14}>14</Option>
                    <Option value={15}>15</Option>
                    <Option value={16}>16</Option>
                    <Option value={17}>17</Option>
                    <Option value={18}>18</Option>
                    <Option value={19}>19</Option>
                    <Option value={20}>20</Option>
                    <Option value={21}>21</Option>
                    <Option value={22}>22</Option>
                    <Option value={23}>23</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    offset:6,
                    span: 24,
                }}
                >
                  <Button type="primary" htmlType="submit">
                      Set
                  </Button>
                </Form.Item>
            </Form>
    </Modal>
    </>
  )
}

export default Room
