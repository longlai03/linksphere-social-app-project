import { ArrowLeftOutlined, GlobalOutlined, LockOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, message, Select, Tabs } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import DefaultImage from '../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import type { AttachtmentItem, PostEdit, MediaItem } from '../../context/interface';
import ImageField from "../../provider/input/ImageField";
import TextareaField from "../../provider/input/TextareaField";
import TextField from '../../provider/input/TextField';
import Avatar from "../../provider/layout/components/Avatar";
import Button from "../../provider/layout/components/Button";
import Text from "../../provider/layout/components/Text";
import { PostValidation } from '../../provider/validation/PostValidation';
import { createPost, updatePost, clearPostEdit } from '../../store/post';
import { CreatePostDefaultValue } from "../../store/post/constant";
import type { AppDispatch, RootState } from '../../store/redux';

interface PostFormProps {
    onClose: () => void;
}

interface PostFormData {
    privacy: string;
    caption: string;
    media: AttachtmentItem[];
}

const convertMediaToAttachment = (media: MediaItem[]): AttachtmentItem[] => {
    return media.map(item => ({
        position: item.position,
        tagged_user: item.tagged_user || undefined,
        base64: item.attachment?.file_url ? `http://localhost:8000/${item.attachment.file_url}` : undefined
    }));
};

const privacyOptions = [
    { label: 'Công khai', value: 'public', icon: <GlobalOutlined /> },
    { label: 'Bạn bè', value: 'friends', icon: <UsergroupAddOutlined /> },
    { label: 'Chỉ mình tôi', value: 'private', icon: <LockOutlined /> },
];

const PostForm = ({ onClose }: PostFormProps) => {
    const { postId } = useParams();
    const isEditMode = !!postId;
    const { user } = useSelector((state: RootState) => state.auth);
    const { postEdit } = useSelector((state: RootState) => state.post);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const imageFieldRef = useRef<any>(null);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

    const { control, handleSubmit: hookFormSubmit, getValues, setValue, trigger, formState: { errors }, reset, watch } = useForm<PostFormData>({
        resolver: yupResolver(PostValidation),
        defaultValues: isEditMode && postEdit ? {
            privacy: postEdit.privacy || "private",
            caption: postEdit.caption || "",
            media: postEdit.media ? convertMediaToAttachment(postEdit.media) : []
        } : CreatePostDefaultValue
    });

    const caption = watch("caption") || "";

    useEffect(() => {
        if (isEditMode && postEdit) {
            const mediaData = postEdit.media ? convertMediaToAttachment(postEdit.media) : [];
            reset({
                privacy: postEdit.privacy || "private",
                caption: postEdit.caption || "",
                media: mediaData
            });
            // Set image data for tabs
            setImageData(mediaData);
            // Set preview image if there's media
            if (postEdit.media && postEdit.media.length > 0 && postEdit.media[0].attachment) {
                setPreviewImage(`http://localhost:8000/${postEdit.media[0].attachment.file_url}`);
            }
            // Set active tab to first image if exists
            if (mediaData.length > 0) {
                setActiveTabKey("1");
            }
        }
    }, [isEditMode, postEdit, reset]);

    const handleImageChange = useCallback((value: string) => {
        // Add new image to tabs
        setImageData(prev => {
            const newData = [...prev, { position: prev.length, base64: value }];
            setValue("media", newData);
            setActiveTabKey(String(newData.length));
            setPreviewImage(value);
            return newData;
        });
    }, [setValue]);

    const handleSubmit = useCallback(() => {
        trigger()
            .then(async (res) => {
                if (res) {
                    const data = getValues();
                    try {
                        if (isEditMode && postId) {
                            await dispatch(updatePost({ postId: parseInt(postId), postData: data })).unwrap();
                            messageApi.open({
                                type: 'success',
                                content: "Cập nhật bài viết thành công!",
                            });
                        } else {
                            await dispatch(createPost(data)).unwrap();
                            messageApi.open({
                                type: 'success',
                                content: "Tạo bài viết thành công!",
                            });
                        }
                        dispatch(clearPostEdit());
                        onClose();
                    } catch (error) {
                        messageApi.open({
                            type: 'error',
                            content: isEditMode ? "Cập nhật bài viết thất bại. Vui lòng thử lại!" : "Tạo bài viết thất bại. Vui lòng thử lại!"
                        });
                        console.error(isEditMode ? "Update post failed:" : "Create post failed:", error);
                    }
                } else {
                    console.log(errors);
                }
            })
            .catch((e) => console.error(e));
    }, [trigger, getValues, isEditMode, postId, dispatch, onClose, errors, messageApi]);

    const [imageData, setImageData] = useState<AttachtmentItem[]>([]);
    const [activeTabKey, setActiveTabKey] = useState<string | undefined>(undefined);
    const privacy = watch("privacy") || "private";
    const [showPrivacySelect, setShowPrivacySelect] = useState<boolean>(false);

    // Remove image and tab
    const handleRemoveImage = useCallback((idx: number) => {
        setImageData(prev => {
            const filteredData = prev.filter((_, i) => i !== idx)
                .map((item, i) => ({ ...item, position: i }));
            setValue("media", filteredData);

            // Update preview and active tab
            if (filteredData.length === 0) {
                setPreviewImage(undefined);
                setActiveTabKey(undefined);
            } else {
                const nextIdx = Math.min(idx, filteredData.length - 1);
                setPreviewImage(filteredData[nextIdx].base64);
                setActiveTabKey(String(nextIdx + 1));
            }

            return filteredData;
        });
    }, [setValue]);

    const handleTabChange = useCallback((key: string) => {
        setActiveTabKey(key);
        // Update preview when changing tabs
        const idx = parseInt(key) - 1;
        const image = imageData[idx];
        if (image?.base64) {
            setPreviewImage(image.base64);
        }
    }, [imageData]);

    // Tabs data
    const imageTabs = imageData.map((img, idx) => ({
        label: `Ảnh ${idx + 1}`,
        key: (idx + 1).toString(),
        children: (
            <div className="space-y-4">
                <div className="relative aspect-square w-full">
                    <img 
                        src={img.base64} 
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-contain"
                    />
                </div>
                <TextField
                    name={`media[${idx}].tagged_user`}
                    control={control}
                    label="Tag bạn bè"
                    type="text"
                    placeholder="Nhập tên người dùng để tag"
                    value={img.tagged_user}
                />
            </div>
        ),
    }));

    const getPrivacyIcon = (privacy: string) => {
        switch (privacy) {
            case 'public':
                return <GlobalOutlined style={{ fontSize: 18 }} />;
            case 'friends':
                return <UsergroupAddOutlined style={{ fontSize: 18 }} />;
            case 'private':
                return <LockOutlined style={{ fontSize: 18 }} />;
            default:
                return <SettingOutlined style={{ fontSize: 18 }} />;
        }
    };

    return (
        <div className="bg-white w-full h-full md:h-[600px] rounded-lg overflow-hidden flex flex-col">
            {contextHolder}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <Button
                    onClick={onClose}
                    className="black"
                    variant="plain"
                    fullWidth={false}
                >
                    <ArrowLeftOutlined />
                </Button>
                <Text type="body" className="font-semibold">{isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</Text>
                <Button
                    type="submit"
                    variant="plain"
                    fullWidth={false}
                    className="text-blue-500 text-sm font-semibold"
                    onClick={handleSubmit}
                >
                    {isEditMode ? 'Lưu' : 'Chia sẻ'}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="w-full md:flex-1 bg-gray-100 flex justify-center items-center relative aspect-square md:aspect-auto">
                    <ImageField
                        ref={imageFieldRef}
                        name="media"
                        onChange={handleImageChange}
                        preview={previewImage}
                    />
                </div>
                <div className="w-full md:w-[340px] border-t md:border-t-0 md:border-l border-gray-200 p-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3 relative">
                        <div className='flex items-center'>
                            <Avatar
                                src={user?.avatar_url
                                    ? `http://localhost:8000/${user.avatar_url}`
                                    : DefaultImage}
                                size={32}
                            />
                            <Text type="body" className="font-semibold">{user.username ?? "Guest"}</Text>
                        </div>
                        <div className="relative">
                            <span
                                onClick={() => setShowPrivacySelect((prev) => !prev)}
                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                            >
                                {getPrivacyIcon(privacy)}
                            </span>
                            {showPrivacySelect && (
                                <div className="absolute right-0 mt-2 z-10">
                                    <Select
                                        value={privacy}
                                        options={privacyOptions.map(opt => ({
                                            ...opt,
                                            label: (
                                                <span className="flex items-center gap-2">
                                                    {opt.icon}
                                                    {opt.label}
                                                </span>
                                            ),
                                        }))}
                                        onChange={(value) => {
                                            setValue("privacy", value);
                                            setShowPrivacySelect(false);
                                        }}
                                        style={{ width: 160 }}
                                        open
                                        onBlur={() => setShowPrivacySelect(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <TextareaField
                        name="caption"
                        control={control}
                        placeholder="Viết gì đó..."
                        rows={8}
                    />
                    <Text type="caption" className="text-end mt-1">{caption.length}/2.200</Text>
                    <Divider />
                    <Text type='body' className='mb-2'>Tùy chỉnh</Text>
                    <Tabs
                        onEdit={(targetKey, action) => {
                            if (action === 'remove') {
                                handleRemoveImage(Number(targetKey) - 1);
                            }
                            if (action === 'add') {
                                imageFieldRef.current?.triggerFileInput();
                            }
                        }}
                        onChange={handleTabChange}
                        activeKey={activeTabKey}
                        type="editable-card"
                        items={imageTabs}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostForm;
