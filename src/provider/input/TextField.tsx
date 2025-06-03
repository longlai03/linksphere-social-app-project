import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

interface TextFieldProp {
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
    rows = 3,
    fullWidth = true,
}: TextFieldProp) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

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
                render={({ field, fieldState: { error } }) => (
                    <>
                        <div className="relative items-center">
                            {icon && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {icon}
                                </div>
                            )}
                            <input
                                {...field}
                                id={id ?? name}
                                type={isPassword ? (showPassword ? "text" : "password") : type}
                                placeholder={placeholder}
                                className={`border px-3 py-2 rounded text-sm
                                    ${fullWidth ? "w-full" : "w-auto"}
                                    ${icon ? "pl-10" : "pl-3"}
                                    ${isPassword ? "pr-10" : ""}
                                    ${error ? "border-red-500" : ""}
                                `}
                            />
                            {isPassword && (
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="!absolute right-1 top-1/2 -translate-y-1/2 !p-1 text-gray-500"
                                    type="button"
                                >
                                    {showPassword ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>
                            )}
                        </div>
                        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};

export default TextField;
