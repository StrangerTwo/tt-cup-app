import { ReactNode } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { isDefined } from "../../lib/utils";

export interface TextAreaProps<T extends FieldValues> {
    label?: string;
    id?: string;
    name: Path<T>;
    value?: string | number | ReadonlyArray<string>;
    placeholder?: string;
    className?: false | string;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    success?: boolean;
    required?: boolean;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    onContainerClick?: React.MouseEventHandler<HTMLDivElement>;
    onChange?: (event: any) => void;
    form: {
        formState: UseFormReturn<T>["formState"];
        register: UseFormReturn<T>["register"];
        setValue: UseFormReturn<T>["setValue"];
        watch: UseFormReturn<T>["watch"];
    };
}

export const TextArea = <T extends FieldValues>({
    label,
    id,
    name,
    value,
    placeholder,
    className,
    disabled,
    readOnly,
    required,
    onChange,
    form,
}: TextAreaProps<T>) => {
    const error = form.formState.errors[name];

    return (
        <div className={twMerge(className)}>
            {label && (
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                rows={6}
                className={twMerge(
                    "z-10 block w-full rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-400",
                    "border border-gray-300 bg-slate-50 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white",

                    (disabled || readOnly) &&
                        "cursor-not-allowed bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400",
                    className,
                )}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                required={required}
                {...form.register(name, { onChange })}
            />
            <span className="text-sm text-red-600 dark:text-red-500">
                {isDefined(error?.message) ? error?.message : null}
            </span>
        </div>
    );
};
