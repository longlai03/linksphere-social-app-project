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
                        <select
                            {...field}
                            id={id ?? name}
                            className={`w-full rounded border px-3 py-2 text-sm ${error ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error.message}</p>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default ComboBoxField;
