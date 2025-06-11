import { Modal, Button, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultImage from '../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import TextField from '../../provider/input/TextField';
import Avatar from '../../provider/layout/components/Avatar';
import Text from '../../provider/layout/components/Text';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/redux';
import { getSpecificPost } from '../../store/post';
import PostDetailSkeleton from './PostDetailSkeleton';

function PostDetail() {
    const { postId } = useParams();
    const { specificPost, loading } = useSelector((state: RootState) => state.post);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        const getPostDetail = async () => {
            if (postId) {
                await dispatch(getSpecificPost(postId)).unwrap();
            }
        }
        getPostDetail();
    }, [dispatch, postId]);

    const { control, getValues, reset } = useForm<{ comment: string }>({
        defaultValues: { comment: "" }
    });

    const [comments, setComments] = useState(specificPost.comments ?? []);

    useEffect(() => {
        setComments(specificPost.comments ?? []);
    }, [specificPost.comments]);

    const handleModalClose = () => navigate(-1);

    return (
        <Modal
            open={true}
            onCancel={handleModalClose}
            footer={null}
            width={900}
            centered
            destroyOnHidden
        >
            {loading ? (
                <PostDetailSkeleton />
            ) : (
                <div className="flex flex-col md:flex-row h-[600px]">
                    {/* Image section */}
                    <div className="flex-1 bg-gray-100 flex items-center justify-center min-w-[350px]">
                        <img
                            src={
                                specificPost.media && specificPost.media.length > 0 && specificPost.media[0].attachment
                                    ? `http://localhost:8000/${specificPost.media[0].attachment.file_url}`
                                    : DefaultImage
                            }
                            alt="post"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                    {/* Right section */}
                    <div className="w-full md:w-[400px] flex flex-col h-full">
                        {/* User info, caption, tagged users */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                            <Avatar
                                src={specificPost.user?.avatar_url ? `http://localhost:8000/${specificPost.user.avatar_url}` : DefaultImage}
                                size={40}
                            />
                            <Text type="body" className="font-semibold">{specificPost.user?.username ?? "Unknown"}</Text>
                        </div>
                        <div className="px-5 py-3 border-b border-gray-100">
                            <Text type="body">{specificPost.caption}</Text>
                        </div>
                        {/* Comments */}
                        <div className="flex-1 overflow-y-auto px-5 py-3">
                            {comments.length === 0 ? (
                                <Text type="caption" className="text-gray-400">Chưa có bình luận</Text>
                            ) : (
                                comments.map((comment: any) => (
                                    <div key={comment.id} className="flex items-start gap-3 mb-3">
                                        <Avatar
                                            src={comment.user?.avatar_url ? `http://localhost:8000/${comment.user.avatar_url}` : DefaultImage}
                                            size={28}
                                        />
                                        <div>
                                            <Text type="body" className="font-semibold">{comment.user?.username ?? "Unknown"}</Text>
                                            <span className="ml-2">{comment.content}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Comment input */}
                        <div className="border-t border-gray-200 px-5 py-3 flex items-center gap-2">
                            <TextField
                                name="comment"
                                control={control}
                                type="text"
                                placeholder="Thêm bình luận..."
                                fullWidth={true}
                            />
                            <Button
                                type="primary"
                                className="ml-2"
                            // onClick={handleComment}
                            >
                                Đăng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default PostDetail;