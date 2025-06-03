import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../../assets/images/logo.png';
import LogoTitle from '../../assets/images/logotitle.png';
import Text from './components/Text';
import SearchPanel from './components/SearchPanel';
import NotificationPanel from './components/NotificationPanel';
import SlidingPanelLayout from './components/SlidingPanelLayout';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const isCompact =
        isSearchOpen ||
        isNotificationOpen ||
        !['/', '/create-post', '/user', '/edit-account'].includes(location.pathname);
    const goTo = useCallback(
        (path: string) => {
            setIsSearchOpen(false);
            setIsNotificationOpen(false);
            navigate(path);
        },
        [navigate]
    );

    const togglePanel = (panel: 'search' | 'notification') => {
        if (panel === 'search') {
            setIsSearchOpen(prev => {
                if (prev) return false;
                setIsNotificationOpen(false);
                return true;
            });
        }
        if (panel === 'notification') {
            setIsNotificationOpen(prev => {
                if (prev) return false;
                setIsSearchOpen(false);
                return true;
            });
        }
    };

    const navItems = useMemo(
        () => [
            {
                icon: <HomeOutlinedIcon />,
                activeIcon: <HomeIcon />,
                label: 'Trang chủ',
                action: () => goTo('/'),
                match: '/',
            },
            {
                icon: <SearchIcon />,
                activeIcon: <SearchIcon />,
                label: 'Tìm kiếm',
                action: () => togglePanel('search'),
                match: '/search',
            },
            {
                icon: <ChatBubbleOutlineOutlinedIcon />,
                activeIcon: <ChatIcon />,
                label: 'Tin nhắn',
                action: () => goTo('/messages'),
                match: '/messages',
            },
            {
                icon: <FavoriteBorderIcon />,
                activeIcon: <FavoriteIcon />,
                label: 'Thông báo',
                action: () => togglePanel('notification'),
                match: '/notifications',
            },
            {
                icon: <AddBoxOutlinedIcon />,
                activeIcon: <AddBoxIcon />,
                label: 'Tạo bài viết',
                action: () => goTo('/create-post'),
                match: '/create-post',
            },
            {
                icon: <PersonOutlinedIcon />,
                activeIcon: <PersonIcon />,
                label: 'Trang cá nhân',
                action: () => goTo('/user'),
                match: '/user',
            },
        ],
        [goTo]
    );

    return (
        <>
            <aside
                className={clsx(
                    'h-screen border-r border-gray-200 p-4 sticky top-0 bg-white shrink-0',
                    'transition-all duration-300 ease-in-out z-50',
                    isCompact ? 'w-[82px]' : 'w-[244px]'
                )}
            >
                <div
                    className={clsx(
                        'mb-4 transition-all duration-300 ease-in-out flex items-center cursor-pointer',
                        isCompact ? 'justify-center' : 'pl-2'
                    )}
                    onClick={() => navigate('/')}
                >
                    <img
                        src={isCompact ? Logo : LogoTitle}
                        alt="Linksphere Logo"
                        className={clsx('h-12 transition-opacity duration-300', isCompact ? 'w-12' : 'w-auto')}
                        style={{ objectFit: 'contain' }}
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
                                        'flex items-center gap-4 p-3 rounded hover:bg-gray-100 cursor-pointer',
                                        isActive && 'font-bold'
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

            <SlidingPanelLayout
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                position="left"
            >
                <SearchPanel
                    onClose={() => setIsSearchOpen(false)}
                    onSelectUser={() => setIsSearchOpen(false)}
                />
            </SlidingPanelLayout>

            <SlidingPanelLayout
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                position="left"
            >
                <NotificationPanel
                    onClose={() => setIsNotificationOpen(false)}
                />
            </SlidingPanelLayout>
        </>
    );
};

export default SideBar;
