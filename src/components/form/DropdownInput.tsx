import { FieldValues, useWatch } from "react-hook-form";

import { DropdownContainer, DropdownContainerProps } from "./DropdownContainer";
import { Input, InputProps } from "./Input";

type Props<T, F extends FieldValues> = InputProps<F> & {
    className?: string;
    options: DropdownContainerProps<T>["options"];
};

export const DropdownInput = <T, F extends FieldValues>({ className, options, ...inputProps }: Props<T, F>) => {
    const { form, name } = inputProps;
    const { setValue, control } = form;

    const onChange = (x: T) => {
        setValue(name, x as any);
    };
    const value = useWatch({ name, control });
    const displayValue = options.find((o) => o.value === value)?.label;

    return (
        <DropdownContainer className={className} options={options} onChange={onChange} iconClassName="size-2.5">
            {({ setOpen, icon }) => (
                <Input
                    {...inputProps}
                    value={displayValue}
                    className="grow"
                    trailingIcon={icon}
                    onContainerClick={() => setOpen((x) => !x)}
                />
            )}
        </DropdownContainer>
    );
};
