import { ReactNode } from "react";
import { FieldErrors, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { isDefined } from "../../lib/utils";
import { getNested } from "./getNested";

export interface InputProps<T extends FieldValues> {
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

export const Input = <T extends FieldValues>({
    label,
    id,
    name,
    value,
    placeholder,
    className,
    disabled,
    readOnly,
    required,
    leadingIcon,
    trailingIcon,
    onContainerClick,
    onChange,
    form,
}: InputProps<T>) => {
    const error = getNested<FieldErrors<T>, { message: string }>(form.formState.errors, name);

    return (
        <div className={twMerge(className)}>
            {label && (
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <div className="relative flex" onClick={onContainerClick}>
                {leadingIcon && (
                    <span className="inline-flex items-center rounded-e-none rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                        {leadingIcon}
                    </span>
                )}
                <input
                    type="text"
                    id={id}
                    className={twMerge(
                        "z-10 block w-full rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-400",
                        "border border-gray-300 bg-slate-50 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white",

                        leadingIcon && "rounded-s-none",
                        trailingIcon && "rounded-e-none",
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
                {trailingIcon && (
                    <span
                        className={twMerge(
                            "inline-flex items-center rounded-e-md rounded-s-none border border-e-0",
                            "border-gray-300 bg-slate-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-slate-600 dark:text-gray-400",
                        )}>
                        {trailingIcon}
                    </span>
                )}
            </div>
            <span className="text-sm text-red-600 dark:text-red-500">
                {isDefined(error?.message) ? error?.message : null}
            </span>
        </div>
    );
};
