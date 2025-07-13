import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
    variant?: "primary" | "secondary" | "plain";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

const Button = ({
    children,
    isLoading = false,
    fullWidth = true,
    variant = "primary",
    disabled = false,
    type = "button",
    onClick,
    className = "",
}: ButtonProps) => {
    const baseStyles = {
        primary:
            "bg-blue-500 text-white py-2 rounded font-semibold transition duration-200 hover:bg-blue-600 disabled:opacity-60",
        secondary:
            "bg-gray-100 text-black py-2 rounded font-semibold transition duration-200 hover:bg-gray-200 disabled:opacity-60 border border-gray-300",
        plain:
            "bg-transparent text-blue-600 underline underline-offset-2 hover:text-blue-800 px-0 py-0 rounded-none disabled:opacity-60",
    };
    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles[variant]} ${widthClass} ${className}`}
            disabled={isLoading || disabled}
        >
            {isLoading ? "Đang xử lý..." : children}
        </button>
    );
};

export default Button;
