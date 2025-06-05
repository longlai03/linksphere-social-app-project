import React, { useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { PictureOutlined } from "@ant-design/icons";
import Text from "../layout/components/Text";

interface ImageFieldProps {
    name: string;
    control: Control<any>;
}

const ImageField: React.FC<ImageFieldProps> = ({ name, control }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => {
                const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            onChange(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                    }
                };

                return (
                    <div className="absolute inset-0 bg-gray-100">
                        <label
                            htmlFor={name}
                            className="flex items-center justify-center w-full h-full cursor-pointer z-10"
                        >
                            {value ? (
                                <img src={value} alt="preview" className="h-full w-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <PictureOutlined style={{ fontSize: "24px" }} />
                                    <Text type="body" className="mt-2 text-sm">Nhấn để thêm ảnh</Text>
                                </div>
                            )}
                        </label>
                        <input
                            id={name}
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                );
            }}
        />
    );
};

export default ImageField;
