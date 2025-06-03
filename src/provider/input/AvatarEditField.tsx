import React, { useRef, useState, useEffect } from "react";
import Avatar from "../layout/components/Avatar";
import { Controller, type Control } from "react-hook-form";
import Button from "../layout/components/Button";

interface AvatarEditFieldProps {
    control: Control<any>;
    name: string;
    size?: number;
}

const AvatarEditField = ({ control, name, size = 40 }: AvatarEditFieldProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>("");

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    setPreview(field.value || "");
                }, [field.value]);

                const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const objectUrl = URL.createObjectURL(file);
                        setPreview(objectUrl);
                        field.onChange(objectUrl);
                    }
                };

                return (
                    <div className="flex items-center justify-between">
                        <Avatar src={preview || ""} alt="avatar" size={size} />

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
