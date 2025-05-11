import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";

const MainLayout = () => {

    return (
        <div className="flex min-h-screen bg-white text-black">
            <SideBar />
            <Outlet />
        </div>
    );
};

export default MainLayout;
