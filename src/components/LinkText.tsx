import clsx from "clsx";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface LinkTextProps {
    to: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    useColor?: boolean;
}

const LinkText = ({
    to,
    onClick,
    children,
    className = "",
    useColor = true,
}: LinkTextProps) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        }
    };

    return (
        <NavLink
            to={to}
            onClick={handleClick}
            className={clsx(
                "text-xs text-center mt-4 cursor-pointer",
                useColor && "text-blue-500",
                className
            )}
        >

            {children}
        </NavLink>
    );
};

export default LinkText;
