import { useRoutes } from "react-router-dom";
import Login from "../pages/login";
import NotFound from "../pages/notfound";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgot-password";
import Home from "../pages/home";
import Messages from "../pages/message";
import MainLayout from "../provider/layout/MainLayout";

const AppRoutes = () => {
    const routes = useRoutes([
        // Layout chính cho các route sau
        {
            path: "/",
            element: <MainLayout />,
            children: [
                { index: true, element: <Home /> },
                { path: "messages", element: <Messages /> },
            ],
        },

        // Các route không có layout
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element: <ForgotPassword /> },

        // 404
        { path: "*", element: <NotFound /> },
    ]);

    return routes;
};

export default AppRoutes;
