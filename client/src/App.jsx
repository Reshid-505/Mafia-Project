import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ROUTES } from "./routes"
import { ConfigProvider, theme} from 'antd';
import MainContext from "./services/contexts/MainContext";
import { useEffect, useState } from "react";
import io from "socket.io-client"

function App() {
  let [socket,setSocket] = useState()
  // const socket = io.connect("http://localhost:3001")
  useEffect(()=>{
    async function connect(){
      setSocket(()=>io.connect("http://localhost:3001"))
    }
    connect()
  },[])
  const { darkAlgorithm } = theme;
  const router = createBrowserRouter(ROUTES)
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const showAddRoomModal = () => {
    setIsAddRoomModalOpen(true);
  };
  const handleAddRoomOk = () => {
    setIsAddRoomModalOpen(false);
  };
  const handleAddRoomCancel = () => {
    setIsAddRoomModalOpen(false);
  };
  const data={
    socket,
    isAddRoomModalOpen,
    setIsAddRoomModalOpen,
    showAddRoomModal,
    handleAddRoomOk,
    handleAddRoomCancel
  }
  return (
    <ConfigProvider     theme={{
      algorithm: darkAlgorithm
    }}>
      <MainContext.Provider value={data}>
        <RouterProvider router={router} />
      </MainContext.Provider>
    </ConfigProvider>
  )
}

export default App
