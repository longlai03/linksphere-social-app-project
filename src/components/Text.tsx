import clsx from "clsx";
import React from "react";

type TextType = "h1" | "h2" | "h3" | "h4" | "body" | "caption";

interface TextProps {
    children: React.ReactNode;
    type?: TextType;
    className?: string;
}

const baseStyles: Record<TextType, string> = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-semibold",
    h4: "text-lg font-medium",
    body: "text-sm",
    caption: "text-xs text-gray-600",
};

const defaultElementMap: Record<TextType, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    body: "p",
    caption: "span",
};

const Text = ({ children, type = "body", className = "" }: TextProps) => {
    const Element = defaultElementMap[type];
    return <Element className={clsx(baseStyles[type], className)}>{children}</Element>;
};

export default Text;
