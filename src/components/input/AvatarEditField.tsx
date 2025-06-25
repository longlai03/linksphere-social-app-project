import React, { useRef, useState, useEffect } from "react";
import Avatar from "../Avatar";
import { Controller, type Control } from "react-hook-form";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface AvatarEditFieldProps {
    control: Control<any>;
    name: string;
    size?: number;
    defaultValue?: string; // still accept but not used for preview
    previewUrl?: string;
}

const AvatarEditField = ({ control, name, size = 40, defaultValue = "", previewUrl }: AvatarEditFieldProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(previewUrl || "");

    useEffect(() => {
        setPreview(previewUrl || "");
    }, [previewUrl]);

    return (
        <Controller
            control={control}
            name={name}
            defaultValue="" // always use empty string as defaultValue
            render={({ field }) => {
                const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const objectUrl = URL.createObjectURL(file); // Preview image URL
                        const reader = new FileReader();

                        reader.onloadend = () => {
                            const base64String = reader.result as string;
                            // Update field value with base64String for form submission
                            field.onChange(base64String);
                        };

                        // Convert image to base64 and update preview
                        reader.readAsDataURL(file);
                        setPreview(objectUrl); // Set preview URL for display
                    }
                };

                return (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center relative group">
                            <Avatar
                                src={preview || ""}
                                alt="avatar"
                                size={size}
                                className="border-2 border-blue-200 shadow-md transition-all duration-200 group-hover:brightness-90"
                            />
                            <Button
                                icon={<EditOutlined />}
                                shape="circle"
                                size="small"
                                className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 shadow group-hover:scale-110"
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e5e7eb",
                                    color: "#1677ff",
                                }}
                                onClick={() => inputRef.current?.click()}
                                type="default"
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={inputRef}
                            onChange={onFileChange}
                        />
                        <span className="text-xs text-gray-400">Nhấn vào bút để thay đổi ảnh đại diện</span>
                    </div>
                );
            }}
        />
    );
};

export default AvatarEditField;
