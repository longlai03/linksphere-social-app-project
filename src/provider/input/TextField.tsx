import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

interface TextFieldProp {
    id?: string;
    name: string;
    control: Control<any>;
    type: "text" | "number" | "password" | "email";
    placeholder?: string;
    defaultValue?: string;
    icon?: React.ReactNode;
    label?: string;
}

const TextField = ({
    id,
    name,
    control,
    type,
    placeholder,
    defaultValue,
    icon,
    label,
}: TextFieldProp) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="relative w-full space-y-1">
            {label && (
                <label htmlFor={id ?? name} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue ?? ""}
                render={({ field, fieldState: { error } }) => (
                    <div className="relative">
                        {/* Left icon */}
                        {icon && (
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {icon}
                            </div>
                        )}

                        {/* Input */}
                        <input
                            {...field}
                            id={id ?? name}
                            type={isPassword ? (showPassword ? "text" : "password") : type}
                            placeholder={placeholder}
                            className={`w-full border px-3 py-2 rounded text-sm 
                                ${icon ? 'pl-10' : 'pl-3'} 
                                ${isPassword ? 'pr-10' : ''} 
                                ${error ? 'border-red-500' : ''}`}
                        />

                        {/* Toggle password icon */}
                        {isPassword && (
                            <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="!absolute right-1 top-1/2 -translate-y-1/2 !p-1 text-gray-500"
                            >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                        )}

                        {/* Error message */}
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error.message}</p>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default TextField;
