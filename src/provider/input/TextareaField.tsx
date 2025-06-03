import React from "react";
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
                        <textarea
                            {...field}
                            id={id ?? name}
                            placeholder={placeholder}
                            rows={rows}
                            className={`w-full border px-3 py-2 rounded text-sm resize-none 
                                ${error ? 'border-red-500' : ''}`
                            }
                        />
                        {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};

export default TextareaField;
