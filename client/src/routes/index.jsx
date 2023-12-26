import Lobby from "../pages/User/Lobby";
import Rooms from "../pages/User/Rooms";
import UserLayout from "../pages/User/UserLayout";

export const ROUTES =[
    {
        path:"/",
        element:<UserLayout/>,
        children:[
            {
                index:true,
                element:<Lobby />
            },
            {
                path:"/rooms",
                element: <Rooms />
            }
        ]
    }
]