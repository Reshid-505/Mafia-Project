import { Button } from "antd"
import { useContext } from "react"
import { Link } from "react-router-dom"
import MainContext from "../../services/contexts/MainContext"
import CreateRoom from "../../components/CreateRoom"
function Lobby() {
  const {showAddRoomModal} = useContext(MainContext)
  
  return (
    <>
      <div className="lobby">
        <Button onClick={showAddRoomModal}>Create Room</Button> 
        <Link to="/rooms">
          <Button>Join Room</Button> 
        </Link>
      </div>
      <CreateRoom />
    </>
  )
}

export default Lobby
