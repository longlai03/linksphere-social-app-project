import { Card, Skeleton } from "antd";

export const ProfileDetailSkeleton = () => (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[500px]">
        <div className="flex items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
                <Skeleton.Avatar active size={40} />
                <div>
                    <Skeleton.Input style={{ width: 120, height: 32 }} active size="small" />
                    <Skeleton.Input style={{ width: 80, height: 20, marginTop: 8 }} active size="small" />
                </div>
            </div>
            <div className="flex align-bottom mb-4 text-sm">
                <Skeleton.Button style={{ width: 80, height: 32, marginRight: 16 }} active size="small" />
                <Skeleton.Button style={{ width: 120, height: 32, marginRight: 16 }} active size="small" />
                <Skeleton.Button style={{ width: 120, height: 32 }} active size="small" />
            </div>
            <Skeleton.Button style={{ width: 120, height: 32 }} active size="small" />
        </div>
        <div className="mt-4">
            <Card>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        </div>
        <div className="mt-4">
            <Skeleton active paragraph={{ rows: 4 }} />
        </div>
    </div>
);