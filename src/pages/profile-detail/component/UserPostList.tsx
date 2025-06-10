import { HeartOutlined, MessageOutlined, GlobalOutlined, LockOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import React from 'react'
import UserPost from './UserPost';

interface UserPostListProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: { id: string; label: string; icon: React.ReactNode }[];
    loading: boolean;
    posts: any[];
}

function UserPostList({ activeTab, onTabChange, tabs, loading, posts }: UserPostListProps) {
    const items: TabsProps['items'] = tabs.map(tab => ({
        key: tab.id,
        label: (
            <span>
                {tab.icon}
                <span className="ml-1">{tab.label}</span>
            </span>
        ),
    }));

    return (
        <>
            <Tabs
                activeKey={activeTab}
                onChange={onTabChange}
                items={items}
                centered
                className='justify-center'
            />

            {/* Content Section */}
            <div className="pt-6">
                {loading ? (
                    <p className="text-center text-sm text-gray-400 py-20">Đang tải dữ liệu...</p>
                ) : posts?.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {posts.map((post) => (
                            <UserPost key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400 py-20">Không có nội dung</p>
                )}
            </div>
        </>
    )
}

export default UserPostList