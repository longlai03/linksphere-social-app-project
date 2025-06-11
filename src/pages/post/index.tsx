import { ArrowLeftOutlined, GlobalOutlined, LockOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, message, Select, Tabs } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DefaultImage from '../../assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png';
import type { AttachtmentItem } from '../../context/interface';
import ImageField from "../../provider/input/ImageField";
import TextareaField from "../../provider/input/TextareaField";
import TextField from '../../provider/input/TextField';
import Avatar from "../../provider/layout/components/Avatar";
import Button from "../../provider/layout/components/Button";
import Text from "../../provider/layout/components/Text";
import { PostValidation } from '../../provider/validation/PostValidation';
import { createPost } from '../../store/post';
import { CreatePostDefaultValue } from "../../store/post/constant";
import type { AppDispatch, RootState } from '../../store/redux';

interface CreatePostProp {
    onClose: () => void;
}

const privacyOptions = [
    { label: 'Công khai', value: 'public', icon: <GlobalOutlined /> },
    { label: 'Bạn bè', value: 'friends', icon: <UsergroupAddOutlined /> },
    { label: 'Chỉ mình tôi', value: 'private', icon: <LockOutlined /> },
];

const CreatePost = ({ onClose }: CreatePostProp) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = useSelector((state: RootState) => state.auth);
    const { control, watch, trigger, getValues, setValue, formState: { errors } } = useForm({
        defaultValues: CreatePostDefaultValue,
        resolver: yupResolver(PostValidation) as any,
    });
    const caption = watch("caption");
    const [imageData, setImageData] = useState<AttachtmentItem[]>([]);
    const [activeTabKey, setActiveTabKey] = useState<string | undefined>(undefined);
    const privacy = watch("privacy");
    const [showPrivacySelect, setShowPrivacySelect] = useState<boolean>(false);
    const imageFieldRef = useRef<{ triggerFileInput: () => void }>(null);

    // Add image and tab
    const handleImageChange = useCallback((base64: string) => {
        setImageData(prev => {
            const newIndex = prev.length;
            const newKey = (newIndex + 1).toString();
            const newImage: AttachtmentItem = {
                position: newIndex + 1,
                base64,
            };
            const newArr = [...prev, newImage];
            setValue("media", newArr); // update react-hook-form value
            setActiveTabKey(newKey);
            return newArr;
        });
    }, [setValue]);

    // Remove image and tab
    const handleRemoveTab = useCallback((targetKey: string) => {
        const idx = Number(targetKey) - 1;
        setImageData(prev => {
            const newArr = prev.filter((_, i) => i !== idx)
                .map((item, i) => ({ ...item, position: i + 1 })); // re-index positions
            setValue("media", newArr); // update react-hook-form value
            // Adjust active tab if needed
            if (newArr.length === 0) {
                setActiveTabKey(undefined);
            } else if (idx === 0) {
                setActiveTabKey("1");
            } else if (idx >= newArr.length) {
                setActiveTabKey(newArr.length.toString());
            } else {
                setActiveTabKey((idx + 1).toString());
            }
            return newArr;
        });
    }, [setValue]);

    const handleTabChange = useCallback((key: string) => {
        setActiveTabKey(key);
    }, []);

    // Tabs data
    const imageTabs = imageData.map((img, idx) => ({
        label: `Image ${idx + 1}`,
        key: (idx + 1).toString(),
        children: (
            <TextField
                name={`media[${idx}].tagged_user`}
                control={control}
                label={`Tag your friend ${idx + 1}`}
                type="text"
                value={img.tagged_user}
            />
        ),
    }));

    // Preview image
    const previewImage = imageData.length && activeTabKey
        ? imageData[Number(activeTabKey) - 1]?.base64
        : undefined;

    const handleSubmit = useCallback(() => {
        trigger()
            .then(async (res) => {
                if (res) {
                    const data = getValues();
                    console.log("Original data", data);
                    try {
                        await dispatch(createPost(data)).unwrap();
                        messageApi.open({
                            type: 'success',
                            content: "Tạo bài viết thành công!",
                        });
                    } catch (error) {
                        messageApi.open({
                            type: 'error',
                            content: "Tạo bài viết thất bại. Vui lòng thử lại.!"
                        });
                        console.error("Create post failed:", error);
                    }
                    onClose();
                } else {
                    console.log(errors);
                }
            })
            .catch((e) => console.error(e));
    }, [trigger, getValues, navigate, errors]);

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
        <div className="bg-white w-full max-w-5xl h-full md:h-[600px] rounded-lg overflow-hidden flex flex-col">
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
                <Text type="body" className="font-semibold">Tạo bài viết mới</Text>
                <Button
                    type="submit"
                    variant="plain"
                    fullWidth={false}
                    className="text-blue-500 text-sm font-semibold"
                    onClick={handleSubmit}
                >
                    Chia sẻ
                </Button>
            </div>

            <div className="flex flex-1 flex-col md:flex-row">
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
                        placeholder="Viết chú thích..."
                        rows={8}
                    />
                    <Text type="caption" className="text-end mt-1">{caption.length}/2.200</Text>
                    <Divider />
                    <Text type='body' className='mb-2'>Tùy chỉnh</Text>
                    <Tabs
                        onEdit={(targetKey, action) => {
                            if (action === 'remove') {
                                handleRemoveTab(targetKey as string);
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

export default CreatePost;
