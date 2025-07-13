import { Input } from "antd";
import { Controller, type Control } from "react-hook-form";

interface TextareaFieldProps {
    id?: string;
    name: string;
    control: Control<any>;
    placeholder?: string;
    defaultValue?: string;
    label?: string;
    rows?: number;
}

const TextareaField = ({
    id,
    name,
    control,
    placeholder,
    defaultValue,
    label,
    rows = 3,
}: TextareaFieldProps) => {
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
                    <>
                        <Input.TextArea
                            {...field}
                            id={id ?? name}
                            placeholder={placeholder}
                            rows={rows}
                            status={error ? "error" : ""}
                            className="resize-none"
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};

export default TextareaField;
