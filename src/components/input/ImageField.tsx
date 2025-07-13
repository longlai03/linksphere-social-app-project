import { PictureOutlined } from "@ant-design/icons";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Text from "../Text";

interface ImageFieldProps {
    name: string;
    onChange: (value: string) => void;
    preview?: string;
}
const ImageField = forwardRef<{ triggerFileInput: () => void }, ImageFieldProps>(
    ({ name, onChange, preview }, ref) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        useImperativeHandle(ref, () => ({
            triggerFileInput: () => {
                inputRef.current?.click();
            }
        }));

        const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    onChange(base64String);
                };

                reader.readAsDataURL(file);
            }
        };

        return (
            <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                <label
                    htmlFor={name}
                    className="flex items-center justify-center w-full h-full cursor-pointer z-10"
                    style={{ minHeight: 200 }}
                >
                    {preview ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <img
                                src={preview}
                                alt="preview"
                                className="max-h-[320px] max-w-full object-contain mx-auto"
                                style={{ display: "block" }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full">
                            <PictureOutlined style={{ fontSize: "24px" }} />
                            <Text type="body" className="mt-2 text-sm">Nhấn để thêm ảnh</Text>
                        </div>
                    )}
                </label>
                <input
                    id={name}
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                />
            </div>
        );
    }
);

export default ImageField;
