import { DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import DefaultImage from '@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import TextFieldComment from '@components/input/TextFieldComment';
import Text from '@components/Text';
import type { MediaItem } from '@context/interface';
import { useErrorHandler } from '@hooks/useErrorHandler';
import { useMessage } from '@layout/MessageProvider';
import PostForm from '@/provider/post/components/PostForm';
import { clearPostEdit, clearSpecificPost, createComment, deleteComment, deletePost, getAllComments, getSpecificPost, likePost, setPostEdit, unlikePost, updateComment } from '@store/post';
import type { AppDispatch, RootState } from '@store/redux';
import { Avatar, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CommentList from './components/CommentList';
import PostDetailSkeleton from './components/PostDetailSkeleton';

function PostDetail() {
    const { postId } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const { specificPost, loading, loadingStates } = useSelector((state: RootState) => state.post);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const message = useMessage();
    const { handleCatchError, handleContextError } = useErrorHandler();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [replyTo, setReplyTo] = useState<any>(null);
    const [editComment, setEditComment] = useState<any>(null);
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (postId) {
            dispatch(clearSpecificPost());
            dispatch(getSpecificPost(parseInt(postId)));
            dispatch(getAllComments({ postId: parseInt(postId) }));
        }
    }, [postId, dispatch]);

    const { control, getValues, reset } = useForm<{ comment: string }>({
        defaultValues: { comment: "" }
    });

    const imageMedia = specificPost.media?.filter(
        (m: MediaItem) => m.attachment && m.attachment.file_url && m.attachment.file_type?.startsWith('image/')
    ) ?? [];

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [specificPost.id]);

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : imageMedia.length - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev => (prev < imageMedia.length - 1 ? prev + 1 : 0));
    };

    const handleModalClose = () => {
        if (!showEditModal) {
            navigate(-1);
        }
    };

    const handleEditClick = () => {
        dispatch(setPostEdit(specificPost));
        setShowEditModal(true);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (postId) {
            try {
                await dispatch(deletePost(parseInt(postId))).unwrap();
                message.success('Bài viết đã được xóa thành công');
                navigate(-1);
            } catch (error: any) {
                handleContextError(error, 'Xóa bài viết');
            }
        }
        setShowDeleteModal(false);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        dispatch(clearPostEdit());
        navigate(-1);
    };

    const handleLike = async () => {
        if (!postId) return;

        try {
            if (specificPost.liked) {
                // Unlike
                await dispatch(unlikePost(parseInt(postId))).unwrap();
            } else {
                // Like
                await dispatch(likePost(parseInt(postId))).unwrap();
            }
        } catch (error) {
            handleCatchError(error, 'Không thể thực hiện thao tác like/unlike');
        }
    };

    const isOwner = user?.id === specificPost?.user_id;
    const isLikeLoading = loadingStates.likePost || loadingStates.unlikePost;

    const handleReply = (comment: any) => {
        setReplyTo(comment);
        setEditComment(null);
        reset({ comment: '' });
    };

    const handleEditComment = (comment: any) => {
        setEditComment(comment);
        setReplyTo(null);
        reset({ comment: comment.content });
    };

    const handleDeleteComment = async (comment: any) => {
        try {
            setCommentLoading(true);
            await dispatch(deleteComment(comment.id)).unwrap();
            message.success('Đã xóa bình luận');
        } catch (error) {
            handleCatchError(error, 'Xóa bình luận');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        console.log('call me');
        const value = getValues('comment');
        if (!value || value.trim() === '') return;
        try {
            setCommentLoading(true);
            if (editComment) {
                await dispatch(updateComment({ commentId: editComment.id, content: value })).unwrap();
                setEditComment(null);
                message.success('Đã sửa bình luận');
            } else {
                await dispatch(createComment({
                    postId: Number(specificPost.id),
                    content: value,
                    reply_comment_id: replyTo ? replyTo.id : null
                })).unwrap();
                setReplyTo(null);
                message.success('Đã thêm bình luận');
            }
            reset({ comment: '' });
        } catch (error) {
            handleCatchError(error, 'Bình luận');
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <>
            {!showEditModal && (
                <Modal
                    open={true}
                    onCancel={handleModalClose}
                    footer={null}
                    width="100%"
                    style={{ maxWidth: 1000, margin: '0 auto' }}
                    className="post-detail-modal"
                    centered
                    wrapClassName="flex items-center justify-center"
                >
                    {loading ? (
                        <PostDetailSkeleton />
                    ) : (
                        <div className="flex flex-col md:flex-row h-[600px]">
                            {/* Image section */}
                            <div className="flex-1 bg-gray-100 flex items-center justify-center min-w-[350px] relative">
                                {imageMedia.length > 0 && (
                                    <>
                                        {imageMedia[currentImageIndex].tagged_user && (
                                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                                <span>@</span>
                                                <span className="text-sm">
                                                    {Array.isArray(imageMedia[currentImageIndex].tagged_user)
                                                        ? imageMedia[currentImageIndex].tagged_user.join(', ')
                                                        : imageMedia[currentImageIndex].tagged_user}
                                                </span>
                                            </div>
                                        )}
                                        <img
                                            src={`http://localhost:8000/${imageMedia[currentImageIndex].attachment?.file_url}`}
                                            alt="post"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                        {imageMedia.length > 1 && (
                                            <>
                                                <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
                                                    <Button
                                                        onClick={handlePrevImage}
                                                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center"
                                                        shape="circle"
                                                        icon={<LeftOutlined />}
                                                    />
                                                </div>
                                                <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
                                                    <Button
                                                        onClick={handleNextImage}
                                                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center"
                                                        shape="circle"
                                                        icon={<RightOutlined />}
                                                    />
                                                </div>
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm z-10">
                                                    {currentImageIndex + 1} / {imageMedia.length}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            {/* Right section */}
                            <div className="w-full md:w-[400px] flex flex-col h-full">
                                {/* User info, caption, tagged users */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            src={specificPost.user?.avatar_url ? `http://localhost:8000/${specificPost.user.avatar_url}` : DefaultImage}
                                            size={40}
                                        />
                                        <Text type="body" className="font-semibold">{specificPost.user?.username ?? "Unknown"}</Text>
                                    </div>
                                    {isOwner && (
                                        <div className='flex gap-1'>
                                            <Button
                                                onClick={handleEditClick}
                                                variant="text"
                                                className="hover:bg-gray-100"
                                            >
                                                <EditOutlined />
                                            </Button>
                                            <Button
                                                onClick={handleDeleteClick}
                                                variant="text"
                                            >
                                                <DeleteOutlined style={{ color: 'red' }} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="px-5 py-3 border-b border-gray-100">
                                    <Text type="body">{specificPost.caption}</Text>
                                    <div className="flex items-center gap-4 mt-3">
                                        <button
                                            onClick={handleLike}
                                            disabled={isLikeLoading}
                                            className={`flex items-center gap-2 ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
                                        >
                                            {specificPost.liked ? (
                                                <HeartFilled className="text-red-500" style={{ fontSize: "20px" }} />
                                            ) : (
                                                <HeartOutlined style={{ fontSize: "20px" }} />
                                            )}
                                            <span className="text-sm font-medium">{specificPost.likesCount || 0} lượt thích</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Comments */}
                                <div className="flex-1 overflow-y-auto px-5 py-3">
                                    {(!specificPost.comments || specificPost.comments.length === 0) ? (
                                        <Text type="caption" className="text-gray-400">Chưa có bình luận</Text>
                                    ) : (
                                        <CommentList
                                            comments={specificPost.comments}
                                            onReply={handleReply}
                                            onEdit={handleEditComment}
                                            onDelete={handleDeleteComment}
                                        />
                                    )}
                                    {(replyTo || editComment) && (
                                        <div className="text-xs text-blue-500 mt-2">
                                            {replyTo && (
                                                <span>Trả lời <b>{replyTo.user?.username}</b></span>
                                            )}
                                            {editComment && (
                                                <span>Sửa bình luận</span>
                                            )}
                                            <Button size="small" type="link" onClick={() => { setReplyTo(null); setEditComment(null); reset({ comment: '' }); }}>Hủy</Button>
                                        </div>
                                    )}
                                </div>
                                {/* Comment input */}
                                <div className="border-t border-gray-200 px-5 py-3 flex items-center gap-2">
                                    <TextFieldComment
                                        name="comment"
                                        control={control}
                                        type="text"
                                        placeholder={replyTo ? `Trả lời ${replyTo.user?.username}` : (editComment ? 'Sửa bình luận...' : 'Thêm bình luận...')}
                                        fullWidth={true}
                                        badge={replyTo?.user?.username}
                                        onRemoveBadge={() => { setReplyTo(null); reset({ comment: '' }); }}
                                    />
                                    <Button
                                        type="primary"
                                        className="ml-2"
                                        loading={commentLoading}
                                        onClick={handleSubmitComment}
                                    >
                                        {editComment ? 'Lưu' : 'Đăng'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
            {showEditModal && (
                <Modal
                    open={true}
                    onCancel={handleCloseEditModal}
                    footer={null}
                    width="100%"
                    style={{ maxWidth: 1000, margin: '0 auto' }}
                    className="post-edit-modal"
                    centered
                    wrapClassName="flex items-center justify-center"
                >
                    <div className="w-full max-w-5xl bg-white rounded-lg">
                        <PostForm onClose={handleCloseEditModal} />
                    </div>
                </Modal>
            )}
            <Modal
                title="Xóa bài viết"
                open={showDeleteModal}
                onOk={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
            </Modal>
        </>
    );
}

export default PostDetail;