import { MouseEventHandler, ReactNode } from "react";
import { FieldValues, Path } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { isDefined } from "../../lib/utils";
import { Card } from "../ui/Card";

export interface BoxSelectProps<T, F extends FieldValues> {
    label?: string;
    id?: string;
    name: Path<F>;
    className?: false | string;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    success?: boolean;
    required?: boolean;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    form: {
        formState: F["formState"];
        register: F["register"];
        setValue: F["setValue"];
        watch: F["watch"];
    };
    options: Array<{
        label: string;
        value: T;
    }>;
    onChange?: (x: T) => void;
}

export const BoxSelect = <T, F extends FieldValues>({
    label,
    id,
    name,
    className,
    disabled,
    readOnly,
    form,
    options,
    onChange,
}: BoxSelectProps<T, F>) => {
    const { formState, watch, setValue } = form;
    const error = formState.errors[name];
    const value = watch(name);

    const select = (o: BoxSelectProps<T, F>["options"][number]): MouseEventHandler<HTMLDivElement> => {
        return (e) => {
            onChange?.(o.value);
            setValue(name, o.value);
        };
    };

    return (
        <div className={twMerge(className)}>
            {label && (
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
            )}
            <div className="flex gap-4">
                <input type="hidden" {...form.register(name)} />
                {options.map((o, i) => (
                    <Card
                        layerStep={value === o.value ? 1 : 0}
                        onClick={select(o)}
                        className={twMerge(
                            "flex flex-col items-center gap-2 p-2 text-sm",
                            value !== o.value && "border-dashed",
                        )}>
                        <span>{o.label}</span>
                    </Card>
                ))}
            </div>
            <span className="text-sm text-red-600 dark:text-red-500">
                {isDefined(error?.message) ? error?.message : null}
            </span>
        </div>
    );
};
