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
