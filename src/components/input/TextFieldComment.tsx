import { CloseOutlined } from '@ant-design/icons';
import { Badge, Button, Input } from "antd";
import React from "react";
import { Controller, type Control } from "react-hook-form";

interface TextFieldCommentProps {
    id?: string;
    name: string;
    control: Control<any>;
    type: "text" | "number" | "password" | "email" | "date";
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    icon?: React.ReactNode;
    label?: string;
    rows?: number;
    fullWidth?: boolean;
    badge?: string;
    onRemoveBadge?: () => void;
}

const TextFieldComment = ({
    id,
    name,
    control,
    type,
    placeholder,
    defaultValue,
    icon,
    label,
    fullWidth = true,
    badge,
    onRemoveBadge,
}: TextFieldCommentProps) => {
    return (
        <div className={`relative ${fullWidth ? "w-full" : "w-auto"} space-y-1`}>
            {label && (
                <label htmlFor={id ?? name} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue ?? ""}
                render={({ field, fieldState: { error } }) => {
                    return (
                        <div className="flex items-center">
                            <Input
                                {...field}
                                id={id ?? name}
                                type={type}
                                placeholder={placeholder}
                                prefix={badge ? (
                                    <span className="flex items-center gap-1">
                                        <Badge count={badge} style={{ backgroundColor: '#1890ff', marginRight: 4 }} />
                                        <Button
                                            size="small"
                                            type="text"
                                            icon={<CloseOutlined style={{ fontSize: 10 }} />}
                                            onClick={onRemoveBadge}
                                            style={{ marginLeft: -8, marginRight: 4 }}
                                        />
                                    </span>
                                ) : icon}
                                status={error ? "error" : ""}
                                className={fullWidth ? "w-full" : ""}
                            />
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default TextFieldComment; 