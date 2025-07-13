import { Select } from "antd";
import { Controller, type Control } from "react-hook-form";

interface ComboBoxOptionProps {
    value: string;
    label: string;
}
interface ComboBoxFieldProps {
    id?: string;
    name: string;
    control: Control<any>;
    label?: string;
    options: ComboBoxOptionProps[];
    defaultValue?: string;
}

const ComboBoxField = ({
    id,
    name,
    control,
    label,
    options,
    defaultValue = "",
}: ComboBoxFieldProps) => {
    return (
        <div className="relative w-full space-y-1">
            {label && (
                <label
                    htmlFor={id ?? name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <Select
                            {...field}
                            id={id ?? name}
                            className="w-full"
                            status={error ? "error" : ""}
                            options={options.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                            }))}
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value)}
                        />
                        {error && (
                            <p className="text-xs text-red-500 mt-1">
                                {error.message}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default ComboBoxField;
