export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

// Check if the value is null or undefined
export function isNil(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}
