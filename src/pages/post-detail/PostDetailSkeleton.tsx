import { Skeleton } from 'antd';

const PostDetailSkeleton = () => (
    <div className="flex flex-col md:flex-row h-[600px]">
        <div className="flex-1 bg-gray-100 flex items-center justify-center min-w-[350px]">
            <Skeleton.Image style={{ width: 350, height: 350 }} active />
        </div>
        <div className="w-full md:w-[400px] flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                <Skeleton.Avatar active size={40} shape="circle" />
                <Skeleton.Input style={{ width: 120 }} active size="small" />
            </div>
            <div className="px-5 py-3 border-b border-gray-100">
                <Skeleton paragraph={{ rows: 2 }} active />
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">
                <Skeleton paragraph={{ rows: 6 }} active />
            </div>
            <div className="border-t border-gray-200 px-5 py-3 flex items-center gap-2">
                <Skeleton.Input style={{ width: 220 }} active size="small" />
                <Skeleton.Button active size="small" />
            </div>
        </div>
    </div>
);

export default PostDetailSkeleton;
