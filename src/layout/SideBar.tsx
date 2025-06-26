import {
    BellFilled,
    BellOutlined,
    HomeFilled,
    HomeOutlined,
    MessageFilled,
    MessageOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import LogoTitle from "../assets/images/logotitle.png";
import CreatePost from "../pages/post";
import type { RootState } from "../store/redux";
import Avatar from "../components/Avatar";
import NotificationPanel from "../components/NotificationPanel";
import SearchPanel from "../pages/search/SearchPanel";
import SlidingPanelLayout from "./SlidingPanelLayout";
import Text from "../components/Text";
import DefaultImage from '../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';


const sidebarRoutes = [
    "/",
    "/messages",
    "/messages/:conversationId",
    "/profile",
    "/user/:userId",
    "/post/:postId",
    "/edit-account"
];

const isSidebarRoute = (pathname: string) => {
    // Convert route patterns to regex and check if pathname matches any
    return sidebarRoutes.some(route => {
        // Replace :param with [^/]+ for dynamic segments
        const pattern = "^" + route.replace(/:[^/]+/g, "[^/]+") + "$";
        return new RegExp(pattern).test(pathname);
    });
};

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth)
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const isCompact =
        isSearchOpen ||
        isNotificationOpen ||
        !["/", "/create-post", `/profile`, "/edit-account", "/post/:postId", "/user"].includes(location.pathname);
    const goTo = useCallback(
        (path: string) => {
            setIsSearchOpen(false);
            setIsNotificationOpen(false);
            navigate(path);
        },
        [navigate]
    );

    const togglePanel = (panel: "search" | "notification") => {
        if (panel === "search") {
            setIsSearchOpen((prev) => {
                if (prev) return false;
                setIsNotificationOpen(false);
                return true;
            });
        }
        if (panel === "notification") {
            setIsNotificationOpen((prev) => {
                if (prev) return false;
                setIsSearchOpen(false);
                return true;
            });
        }
    };

    const navItems = useMemo(
        () => [
            {
                icon: <HomeOutlined />,
                activeIcon: <HomeFilled />,
                label: "Trang chủ",
                action: () => goTo("/"),
                match: "/",
            },
            {
                icon: <SearchOutlined />,
                activeIcon: <SearchOutlined />,
                label: "Tìm kiếm",
                action: () => togglePanel("search"),
                match: "/search",
            },
            {
                icon: <MessageOutlined />,
                activeIcon: <MessageFilled />,
                label: "Tin nhắn",
                action: () => goTo("/messages"),
                match: "/messages",
            },
            {
                icon: <BellOutlined />,
                activeIcon: <BellFilled />,
                label: "Thông báo",
                action: () => togglePanel("notification"),
                match: "/notifications",
            },
            {
                icon: <PlusOutlined />,
                activeIcon: <PlusOutlined />,
                label: "Tạo bài viết",
                action: () => {
                    setIsCreatePostModalOpen(true)
                },
                match: "/create-post",
            },
            {
                icon: <Avatar
                    src={user?.avatar_url
                        ? `http://localhost:8000/${user.avatar_url}`
                        : DefaultImage}
                    size={24}
                />,
                activeIcon: <UserOutlined />,
                label: "Trang cá nhân",
                action: () => goTo(`/profile`),
                match: `/profile`,
            },
        ],
        [goTo]
    );

    const showSidebar = isSidebarRoute(location.pathname);

    if (!showSidebar) return null;

    return (
        <>
            <aside
                className={clsx(
                    "h-screen border-r border-gray-200 p-4 sticky top-0 bg-white shrink-0",
                    "transition-all duration-300 ease-in-out z-50",
                    isCompact ? "w-[82px]" : "w-[244px]"
                )}
            >
                <div
                    className={clsx(
                        "mb-4 transition-all duration-300 ease-in-out flex items-center cursor-pointer",
                        isCompact ? "justify-center" : "pl-2"
                    )}
                    onClick={() => navigate("/")}
                >
                    <img
                        src={isCompact ? Logo : LogoTitle}
                        alt="Linksphere Logo"
                        className={clsx("h-12 transition-opacity duration-300", isCompact ? "w-12" : "w-auto")}
                        style={{ objectFit: "contain" }}
                    />
                </div>
                <ul className="space-y-4">
                    {navItems.map(({ icon, activeIcon, label, action, match }, index) => {
                        const isActive = location.pathname === match;
                        return (
                            <li key={index}>
                                <span
                                    onClick={action}
                                    className={clsx(
                                        "flex items-center gap-4 p-3 rounded hover:bg-gray-100 cursor-pointer",
                                        isActive && "font-bold"
                                    )}
                                >
                                    {isActive ? activeIcon : icon}
                                    {!isCompact && (
                                        <Text type="body" className="transition-opacity duration-300">
                                            {label}
                                        </Text>
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <SlidingPanelLayout isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} position="left">
                <SearchPanel onClose={() => setIsSearchOpen(false)} onSelectUser={() => setIsSearchOpen(false)} />
            </SlidingPanelLayout>

            <SlidingPanelLayout isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} position="left">
                <NotificationPanel onClose={() => setIsNotificationOpen(false)} isOpen={isNotificationOpen} />
            </SlidingPanelLayout>

            <Modal
                open={isCreatePostModalOpen}
                footer={null}
                centered
                closeIcon={false}
                width={{
                    xs: '90%',
                    sm: '85%',
                    md: '80%',
                    lg: '75%',
                    xl: '70%',
                    xxl: '65%',
                }}
            >
                <CreatePost onClose={() => setIsCreatePostModalOpen(false)} />
            </Modal>
        </>
    );
};

export default SideBar;
