import { format, isValid, parseISO } from "date-fns";

const fullDateFormat = "d. M. yyyy";
const fullDateWithHoursShortFormat = "d. M. yyyy HH:mm";
const fullDateShortWithHoursShortFormat = "d. M. yy HH:mm";
const hoursShortFormat = "HH:mm";

export const parseDateInput = (dateInput: Date | string, fallbackDate = new Date()): Date => {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return isValid(date) ? date : fallbackDate;
};

export const renderFullDate = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateFormat);
};

export const renderFullDateWithHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateWithHoursShortFormat);
};

export const renderFullDateShortWithHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateShortWithHoursShortFormat);
};

export const renderHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, hoursShortFormat);
};
