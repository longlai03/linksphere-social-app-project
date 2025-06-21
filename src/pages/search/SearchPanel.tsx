import React, { useState, useEffect, useCallback } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Button from "../../provider/layout/components/Button";
import { getAllUsers } from "../../store/user";
import type { AppDispatch, RootState } from "../../store/redux";
import type { User } from "../../context/interface";
import DefaultImage from "../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";

interface SearchPanelProps {
    onClose: () => void;
    onSelectUser: (user: User) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onClose, onSelectUser }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { searchUsers, loading } = useSelector((state: RootState) => state.user);
    const [searchTerm, setSearchTerm] = useState("");

    const debounceGetApiData = useCallback(
        debounce((query: string) => {
            const getApiDataFilter = async () => {
                await dispatch(getAllUsers(query)).unwrap();
            }
            getApiDataFilter();
        }, 1000),
        [debounce]
    );

    useEffect(() => {
        if (searchTerm.trim() === "") {
            return;
        }
        debounceGetApiData(searchTerm);
    }, [searchTerm, debounceGetApiData]);

    const handleSelect = (user: User) => {
        onSelectUser(user);
        setSearchTerm("");
        if (user.id) {
            navigate(`/user/${user.id}`);
        }
    };

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
                    <CloseOutlined />
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
                <div className="text-gray-500">Nhập từ khóa để tìm kiếm</div>
            ) : loading ? (
                <div className="text-gray-500">Đang tìm kiếm...</div>
            ) : searchUsers.length === 0 ? (
                <div className="text-gray-500">Không tìm thấy kết quả</div>
            ) : (
                <ul>
                    {searchUsers.map((user: User) => (
                        <li
                            key={user.username}
                            onClick={() => handleSelect(user)}
                            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
                        >
                            <img 
                                src={user.avatar_url 
                                    ? `http://localhost:8000/${user.avatar_url}` 
                                    : DefaultImage} 
                                alt={user.username} 
                                className="w-8 h-8 rounded-full" 
                            />
                            <div>
                                <div className="font-semibold">{user.username}</div>
                                <div className="text-xs text-gray-500">{user.nickname || "Không có"}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchPanel;
