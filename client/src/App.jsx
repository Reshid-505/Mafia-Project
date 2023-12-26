import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ROUTES } from "./routes"
import { ConfigProvider, theme} from 'antd';
import MainContext from "./services/contexts/MainContext";
import { useState } from "react";

function App() {
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
