import React, { useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useMatch } from "react-router-dom";
import clsx from "clsx";
import {
    HomeOutlined,
    HomeFilled,
    SearchOutlined,
    MessageOutlined,
    MessageFilled,
    BellOutlined,
    BellFilled,
    PlusOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/images/logo.png";
import LogoTitle from "../../assets/images/logotitle.png";
import Text from "./components/Text";
import SearchPanel from "./components/SearchPanel";
import NotificationPanel from "./components/NotificationPanel";
import SlidingPanelLayout from "./components/SlidingPanelLayout";
import { Modal } from "antd";
import CreatePost from "../../pages/post";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/redux";

const sidebarRoutes = [
    "/",
    "/messages",
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
        !["/", "/create-post", `/user/${user.id}`, "/edit-account", "/post/:postId"].includes(location.pathname);
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
                icon: <UserOutlined />,
                activeIcon: <UserOutlined />,
                label: "Trang cá nhân",
                action: () => goTo(`/user/${user.id}`),
                match: `${user.id}`,
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
                <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
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
