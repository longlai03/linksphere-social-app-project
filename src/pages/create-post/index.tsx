import { ArrowLeftOutlined } from '@ant-design/icons';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ImageField from "../../provider/input/ImageField";
import TextareaField from "../../provider/input/TextareaField";
import Avatar from "../../provider/layout/components/Avatar";
import Button from "../../provider/layout/components/Button";
import Text from "../../provider/layout/components/Text";
import { CreatePostDefaultValue } from "../../store/post/constant";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/redux';
import { calculateTimeAgo } from '../../utils/helpers';

const CreatePost = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { control, watch, trigger, getValues, formState: { errors } } = useForm({
        defaultValues: CreatePostDefaultValue
    });

    console.log(calculateTimeAgo(user.created_at ?? ''));
    const caption = watch("caption");
    const handleSubmit = () => {
        trigger()
            .then((res) => {
                if (res) {
                    const data = getValues();
                    console.log("Original data", data);
                    navigate('/user');
                } else {
                    console.log(errors);
                }
            })
            .catch((e) => console.error(e));
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div
                className="bg-white w-full max-w-5xl h-full md:h-[600px] rounded-lg overflow-hidden flex flex-col"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <Button
                        onClick={() => navigate(-1)}
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
                    <div className="w-full md:flex-1 bg-gray-100 flex items-center justify-center relative aspect-square md:aspect-auto">
                        <ImageField name="image" control={control} />
                    </div>

                    <div className="w-full md:w-[340px] border-t md:border-t-0 md:border-l border-gray-200 p-4 overflow-y-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar src={user.avatar_url ?? ""} size={32} />
                            <Text type="body" className="font-semibold">{user.username}</Text>
                        </div>
                        <TextareaField
                            name="caption"
                            control={control}
                            placeholder="Viết chú thích..."
                            rows={8}
                        />
                        <Text type="caption" className="text-end mt-1">{caption.length}/2.200</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
