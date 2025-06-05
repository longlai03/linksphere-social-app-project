import React, { useRef, useState, useEffect } from "react";
import Avatar from "../layout/components/Avatar";
import { Controller, type Control } from "react-hook-form";
import Button from "../layout/components/Button";

interface AvatarEditFieldProps {
    control: Control<any>;
    name: string;
    size?: number;
    defaultValue?: string;
}

const AvatarEditField = ({ control, name, size = 40, defaultValue = "" }: AvatarEditFieldProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(defaultValue); // Preview URL for the image

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({ field }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    setPreview(field.value || defaultValue);
                }, []);
                
                const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const objectUrl = URL.createObjectURL(file);
                        setPreview(objectUrl);
                        console.log(objectUrl);
                        field.onChange(file);
                    }
                };

                return (
                    <div className="flex items-center justify-between">
                        <Avatar src={preview || ""} alt="avatar" size={size} />  {/* Use preview for avatar */}
                        <Button
                            className="px-3 py-1 border rounded text-sm hover:bg-gray-100 transition"
                            onClick={() => inputRef.current?.click()}
                        >
                            Chỉnh sửa ảnh đại diện
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={inputRef}
                            onChange={onFileChange}
                        />
                    </div>
                );
            }}
        />
    );
};

export default AvatarEditField;
