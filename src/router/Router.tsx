import { useRoutes } from "react-router-dom";
import EditAccount from "@/provider/user/components/ProfileEditForm";
import ForgotPassword from "@pages/forgot-password";
import Home from "@pages/home";
import Login from "@pages/login";
import Messages from "@pages/message";
import NotFound from "@pages/notfound";
import Register from "@pages/register";
import MainLayout from "@layout/MainLayout";
import PostDetail from "@provider/post/PostDetail";
import ProfileDetail from "@provider/user/ProfileDetail";
import RequireAuth from "./RequireAuth";

const AppRoutes = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: (
                <RequireAuth>
                    <MainLayout />
                </RequireAuth>
            ),
            children: [
                { index: true, element: <Home /> },
                { path: "messages", element: <Messages /> },
                { path: "messages/:conversationId", element: <Messages /> },
                { path: "profile", element: <ProfileDetail /> },
                { path: "user/:userId", element: <ProfileDetail /> },
                { path: "post/:postId", element: <PostDetail /> },
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
