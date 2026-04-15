import { format, isValid, parseISO } from "date-fns";

const fullDateWithHoursShortFormat = "d. M. yyyy HH:mm";

export const parseDateInput = (dateInput: Date | string, fallbackDate = new Date()): Date => {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return isValid(date) ? date : fallbackDate;
};

export const renderFullDateWithHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateWithHoursShortFormat);
};
