import React, { useState, useEffect } from "react";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Button from "./Button";

interface User {
    username: string;
    fullname: string;
    avatar: string;
}

interface SearchPanelProps {
    onClose: () => void;
    onSelectUser: (user: User) => void;
}

const mockUsers: User[] = [
    { username: "huogw.lmaz", fullname: "Nguyen Huong Lam", avatar: "https://i.pravatar.cc/40?u=2" },
    { username: "sontungmtp", fullname: "Sơn Tùng M-TP", avatar: "https://i.pravatar.cc/40?u=3" },
];

const SearchPanel: React.FC<SearchPanelProps> = ({ onClose, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [history, setHistory] = useState<User[]>([]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            return;
        }
        const results = mockUsers.filter(
            (user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm]);

    const handleSelect = (user: User) => {
        setHistory((prev) => {
            const filtered = prev.filter((u) => u.username !== user.username);
            return [user, ...filtered].slice(0, 5);
        });
        onSelectUser(user);
        setSearchTerm("");
    };

    const handleClearHistory = () => setHistory([]);

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Tìm kiếm</h2>
                <Button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Đóng tìm kiếm"
                    variant="plain"
                    fullWidth={false}
                >
                    <CloseOutlinedIcon />
                </Button>
            </div>
            <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Tìm kiếm"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.trim() === "" ? (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Mới đây</span>
                        {history.length > 0 && (
                            <Button
                                variant="plain"
                                onClick={handleClearHistory}
                                fullWidth={false}
                                className="text-blue-500 text-sm"
                            >
                                Xóa tất cả
                            </Button>
                        )}
                    </div>
                    <ul>
                        {history.length === 0 && <li className="text-gray-500">Chưa có lịch sử tìm kiếm</li>}
                        {history.map((user) => (
                            <li
                                key={user.username}
                                onClick={() => handleSelect(user)}
                                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
                            >
                                <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                                <div>
                                    <div className="font-semibold">{user.username}</div>
                                    <div className="text-xs text-gray-500">{user.fullname}</div>
                                </div>
                                <Button
                                    variant="plain"
                                    fullWidth={false}
                                    className="ml-auto text-gray-400 hover:text-gray-600 px-2 py-0 text-lg leading-none"
                                    aria-label={`Xóa ${user.username} khỏi lịch sử`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHistory((prev) => prev.filter((u) => u.username !== user.username));
                                    }}
                                >
                                    ×
                                </Button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : searchResults.length === 0 ? (
                <div className="text-gray-500">Không tìm thấy kết quả</div>
            ) : (
                <ul>
                    {searchResults.map((user) => (
                        <li
                            key={user.username}
                            onClick={() => handleSelect(user)}
                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
                        >
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                            <div>
                                <div className="font-semibold">{user.username}</div>
                                <div className="text-xs text-gray-500">{user.fullname}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchPanel;
