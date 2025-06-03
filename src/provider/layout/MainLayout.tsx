import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const MainLayout = () => {

    return (
        <div className="flex bg-white text-black">
            <SideBar />
            <Outlet />
        </div>
    );
};

export default MainLayout;
