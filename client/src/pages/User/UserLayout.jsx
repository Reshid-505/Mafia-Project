import { Outlet } from "react-router-dom"
import Header from "../../components/Header"
function UserLayout() {
  return (
    <>
      <Header />
      <Outlet /> 
    </>
  )
}

export default UserLayout
