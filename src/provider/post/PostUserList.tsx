import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import React from 'react';
import PostUser from './components/PostUser';

interface PostUserListProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: { id: string; label: string; icon: React.ReactNode }[];
    loading: boolean;
    posts: any[];
}

function PostUserList({ activeTab, onTabChange, tabs, loading, posts }: PostUserListProps) {
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
            <div className="pt-6">
                {loading ? (
                    <p className="text-center text-sm text-gray-400 py-20">Đang tải dữ liệu...</p>
                ) : posts?.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {posts.map((post, idx) => (
                            <PostUser key={post?.id ?? idx} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400 py-20">Không có nội dung</p>
                )}
            </div>
        </>
    )
}

export default PostUserList