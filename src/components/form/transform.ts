import { AnySchema } from "yup";

export function transformEmptyToUndefined<T extends AnySchema>(
    this: T,
    value: unknown,
    _originalValue: unknown,
    _schema: T,
): unknown {
    if (value === "" || _originalValue === null || (Array.isArray(value) && value.length === 0)) {
        return undefined;
    }

    return value;
}

export function transformNaNToUndefined<T extends AnySchema>(
    this: T,
    value: unknown,
    _originalValue: unknown,
    _schema: T,
): unknown {
    return Number.isNaN(value) ? undefined : (value as number);
}
