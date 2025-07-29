/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined } from "@ant-design/icons";
import DefaultImage from "@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png";
import Button from "@components/Button";
import type { User } from "@context/interface";
import type { AppDispatch, RootState } from "@store/redux";
import { getAllUsers } from "@store/user";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SearchPanelProps {
    onClose: () => void;
    onSelectUser: (user: User) => void;
}

const SearchPanel = ({ onClose, onSelectUser }: SearchPanelProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { searchUsers, loadingStates } = useSelector((state: RootState) => state.user);
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
            ) : loadingStates.getAllUsers ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <div className="mt-2 text-gray-500 text-sm">Đang tìm kiếm...</div>
                </div>
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
