import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultImage from '../../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import type { MediaItem } from '../../../context/interface';
import PostForm from '../../../pages/post';
import { getSpecificPost, setPostEdit, deletePost, clearPostEdit } from '../../../store/post';
import type { RootState, AppDispatch } from '../../../store/redux';
import TextField from '../../input/TextField';
import { useMessage } from '../MessageProvider';
import PostDetailSkeleton from './components/PostDetailSkeleton';
import Text from '../components/Text';

//Truyen post_id, dispatch getSpecificPost
function PostDetail() {
    const { postId } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const { specificPost, loading } = useSelector((state: RootState) => state.post);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const message = useMessage();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    useEffect(() => {
        if (postId) {
            dispatch(getSpecificPost(parseInt(postId)));
        }
    }, [postId, dispatch]);

    const { control, getValues, reset } = useForm<{ comment: string }>({
        defaultValues: { comment: "" }
    });

    const [comments, setComments] = useState(specificPost.comments ?? []);

    useEffect(() => {
        setComments(specificPost.comments ?? []);
    }, [specificPost.comments]);

    // Get all image media from specificPost
    const imageMedia = specificPost.media?.filter(
        (m: MediaItem) => m.attachment && m.attachment.file_url && m.attachment.file_type?.startsWith('image/')
    ) ?? [];

    // Update currentImageIndex when specificPost changes
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
                message.error(error || 'Không thể xóa bài viết');
            }
        }
        setShowDeleteModal(false);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        dispatch(clearPostEdit());
        navigate(-1);
    };

    const isOwner = user?.id === specificPost?.user_id;

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
                                                {/* Nút chuyển ảnh trái */}
                                                <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
                                                    <Button
                                                        onClick={handlePrevImage}
                                                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center"
                                                        shape="circle"
                                                        icon={<LeftOutlined />}
                                                    />
                                                </div>
                                                {/* Nút chuyển ảnh phải */}
                                                <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
                                                    <Button
                                                        onClick={handleNextImage}
                                                        className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center"
                                                        shape="circle"
                                                        icon={<RightOutlined />}
                                                    />
                                                </div>
                                                {/* Số thứ tự ảnh */}
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
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl bg-white rounded-lg">
                        <PostForm onClose={handleCloseEditModal} />
                    </div>
                </div>
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