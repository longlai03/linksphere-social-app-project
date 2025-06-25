import { Controller, type Control } from "react-hook-form";
import { Input } from "antd";

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
                        {type === "password" ? (
                            <Input.Password
                                {...field}
                                id={id ?? name}
                                placeholder={placeholder}
                                prefix={icon}
                                status={error ? "error" : ""}
                                className={fullWidth ? "w-full" : ""}
                            />
                        ) : type === "text" || type === "email" || type === "number" ? (
                            <Input
                                {...field}
                                id={id ?? name}
                                type={type}
                                placeholder={placeholder}
                                prefix={icon}
                                status={error ? "error" : ""}
                                className={fullWidth ? "w-full" : ""}
                            />
                        ) : (
                            <Input
                                {...field}
                                id={id ?? name}
                                type={type}
                                placeholder={placeholder}
                                status={error ? "error" : ""}
                                className={fullWidth ? "w-full" : ""}
                            />
                        )}
                        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};

export default TextField;
