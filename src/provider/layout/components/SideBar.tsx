import clsx from "clsx";
import LogoTitle from "../../../assets/images/logotitle.png";
import Logo from "../../../assets/images/logo.png";
import Text from "../../input/Text";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useNavigate } from "react-router-dom";


const SideBar = () => {
    const isCompact = location.pathname === "/messages";
    const navigate = useNavigate();
    const navItems = [
        {
            icon: <HomeOutlinedIcon />,
            label: "Home",
            onClick: () => {
                console.log('Home clicked');
                navigate('/');
            },
            match: "/"
        },
        {
            icon: <SearchIcon />,
            label: "Search",
            onClick: () => {
                console.log("Open Search Modal");
            },
            match: "/search"
        },
        {
            icon: <MessageIcon />,
            label: "Messages",
            onClick: () => {
                console.log('Message clicked');
                navigate('/messages');
            },
            match: "/messages"
        },
        {
            icon: <FavoriteBorderIcon />,
            label: "Notifications",
            onClick: () => {
                console.log("Open Notifications");
            },
            match: "/notifications"
        },
        {
            icon: <AddBoxOutlinedIcon />,
            label: "Create",
            onClick: () => {
                console.log('Created clicked');
                navigate('/create');
            },
            match: "/create"
        },
        {
            icon: <PersonOutlinedIcon />,
            label: "Profile",
            onClick: () => {
                console.log('Profile clicked');
                navigate('/user');
            },
            match: "/profile"
        },
    ];

    return (
        <aside
            className={clsx(
                "h-screen border-r border-gray-200 p-4 sticky top-0 bg-white",
                "transition-all duration-300 ease-in-out",
                isCompact ? "w-[82px]" : "w-[300px]"
            )}
        >
            <div
                className={clsx(
                    "mb-4 transition-all duration-300 ease-in-out flex items-center",
                    isCompact ? "justify-center" : "pl-2"
                )}
            >
                <img
                    src={isCompact ? Logo : LogoTitle}
                    alt="Linksphere Logo"
                    className={clsx(
                        "h-12 transition-opacity duration-300",
                        isCompact ? "w-12" : "w-auto"
                    )}
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <ul className="space-y-4">
                {navItems.map(({ icon, label, onClick, match }, index) => {
                    const isActive = location.pathname === match;
                    return (
                        <li key={index}>
                            <span
                                onClick={onClick}
                                className={clsx(
                                    "flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer",
                                    isActive && "font-bold"
                                )}
                            >
                                {icon}
                                {!isCompact && <Text type="body">{label}</Text>}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default SideBar;
