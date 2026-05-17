import { FieldErrors, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { isDefined } from "../../lib/utils";
import { useColorLayer } from "../ui/layout";
import { getNested } from "./getNested";

export type ToggleProps<T extends FieldValues> = {
    label?: string;
    id?: string;
    name: Path<T>;
    className?: false | string;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    success?: boolean;
    required?: boolean;
    onChange?: (event: any) => void;
} & (
    | {
          checked?: boolean;
          form?: never;
      }
    | {
          checked?: never;
          form?: {
              formState: UseFormReturn<T>["formState"];
              register: UseFormReturn<T>["register"];
              setValue: UseFormReturn<T>["setValue"];
              watch: UseFormReturn<T>["watch"];
          };
      }
);

export const Toggle = <T extends FieldValues>({
    label,
    id,
    name,
    checked,
    className,
    disabled,
    readOnly,
    required,
    onChange,
    form,
}: ToggleProps<T>) => {
    const error = getNested<FieldErrors<T> | undefined, { message: string }>(form?.formState.errors, name);

    const { bgColor: disabledBgColor } = useColorLayer(0);
    const { bgColor } = useColorLayer(1);

    return (
        <div className={twMerge("flex flex-col items-start", className)}>
            <label className="inline-flex cursor-pointer items-center">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    readOnly={readOnly}
                    disabled={disabled}
                    required={required}
                    className="peer sr-only"
                    onChange={onChange}
                    {...form?.register(name, { onChange })}
                />
                <div
                    className={twMerge(
                        bgColor,
                        "peer z-10 block p-2.5 peer-focus:border-blue-500 peer-focus:ring-blue-500 peer-focus-visible:border-blue-500 peer-focus-visible:ring-blue-400",
                        "border border-gray-300  text-gray-900 dark:border-slate-600  dark:text-white",
                        "relative h-5 w-9 rounded-full after:absolute",
                        "after:start-[2px] after:top-[2px] after:size-4 after:rounded-full after:bg-white after:transition-all",
                        "after:content-[''] peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4",
                        "rtl:peer-checked:after:-translate-x-full",
                        "peer-checked:border-transparent peer-checked:bg-blue-600",
                        (disabled || readOnly) && "cursor-not-allowed after:bg-slate-400 dark:after:bg-slate-500",
                        (disabled || readOnly) && disabledBgColor,
                        className,
                    )}
                />

                {label && <span className="ms-1 block text-sm font-medium md:ms-2">{label}</span>}
            </label>
            <span className="text-sm text-red-600 dark:text-red-500">
                {isDefined(error?.message) ? error?.message : null}
            </span>
        </div>
    );
};
