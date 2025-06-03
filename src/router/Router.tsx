import { useRoutes } from "react-router-dom";
import Login from "../pages/login";
import NotFound from "../pages/notfound";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgot-password";
import Home from "../pages/home";
import Messages from "../pages/message";
import MainLayout from "../provider/layout/MainLayout";
import ProfileDetail from "../pages/profile-detail";
import CreatePost from "../pages/create-post";
import EditAccount from "../pages/edit-account";

const AppRoutes = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                { index: true, element: <Home /> },
                { path: "messages", element: <Messages /> },
                { path: "user", element: <ProfileDetail /> },
                { path: "create-post", element: <CreatePost /> },
                { path: "edit-account", element: <EditAccount /> },
            ],
        },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "*", element: <NotFound /> },
    ]);

    return routes;
};

export default AppRoutes;
