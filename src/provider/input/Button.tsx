import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    isLoading = false,
    fullWidth = true,
    className = "",
    ...rest
}) => {
    const baseStyles =
        "bg-blue-500 text-white py-2 rounded font-semibold transition duration-200 hover:bg-blue-600 disabled:opacity-60";
    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${widthClass} ${className}`}
            disabled={isLoading || rest.disabled}
            {...rest}
        >
            {isLoading ? "Đang xử lý..." : children}
        </button>
    );
};

export default Button;
