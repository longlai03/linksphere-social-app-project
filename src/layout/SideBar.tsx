import CreatePost from "@/provider/post/components/PostForm";
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
import DefaultImage from '@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import Logo from "@assets/images/logo.png";
import LogoTitle from "@assets/images/logotitle.png";
import Avatar from "@components/Avatar";
import NotificationPanel from "@/pages/notification";
import Text from "@components/Text";
import SearchPanel from "@pages/search/SearchPanel";
import type { RootState } from "@store/redux";
import { Modal } from "antd";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SlidingPanelLayout from "./SlidingPanelLayout";

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
    return sidebarRoutes.some(route => {
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
                icon:
                    <Avatar
                        src={user?.avatar_url
                            ? `http://localhost:8000/${user.avatar_url}`
                            : DefaultImage}
                        size={24}
                        className="object-cover"
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
                    "transition-all duration-300 ease-in-out z-50 overflow-hidden",
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
                        className="h-12 transition-opacity duration-300 object-contain"
                    />
                </div>
                <ul className="space-y-4">
                    {navItems.map(({ icon, activeIcon, label, action, match }, index) => {
                        const isActive =
                            (label === "Tìm kiếm" && isSearchOpen) ||
                            (label === "Thông báo" && isNotificationOpen) ||
                            (label !== "Tìm kiếm" && label !== "Thông báo" && location.pathname === match);
                        const displayIcon = isActive ? activeIcon : icon;
                        const isAvatar = label === 'Trang cá nhân';
                        return (
                            <li key={index}>
                                <span
                                    onClick={action}
                                    className={clsx(
                                        "flex items-center p-3 rounded hover:bg-gray-100 cursor-pointer",
                                        isActive && "font-bold bg-gray-200 gap-0"
                                    )}
                                >
                                    <span className={clsx(
                                        "flex items-center justify-center w-8 h-8 rounded-full",
                                        isActive && "bg-gray-200"
                                    )}>
                                        {isAvatar
                                            ? <Avatar src={user?.avatar_url ? `http://localhost:8000/${user.avatar_url}` : DefaultImage} size={24} className="object-cover" />
                                            : displayIcon}
                                    </span>
                                    <Text
                                        type="body"
                                        className={clsx(
                                            "transition-all duration-300 ease-in-out whitespace-nowrap",
                                            isCompact ? "opacity-0 max-w-0 overflow-hidden pl-0" : "opacity-100 max-w-full pl-4"
                                        )}
                                    >
                                        {label}
                                    </Text>
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
                key={isCreatePostModalOpen ? 'create-post-open' : 'create-post-closed'}
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
