import { format, isValid, parseISO } from "date-fns";
import { cs } from "date-fns/locale";

import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

const czIsoDateFormat = "dd.MM.yyyy";
const fullDateFormat = "d. M. yyyy";
const fullDateShortFormat = "d. M. yy";
const dateShortFormat = "iiiii d. M.";
const fullDateWithHoursShortFormat = "d. M. yyyy HH:mm";
const fullDateShortWithHoursShortFormat = "d. M. yy HH:mm";
const dateShortWithHoursShortFormat = "d. M. HH:mm";
const hoursShortFormat = "HH:mm";

export const parseDateInput = (dateInput: Date | string, fallbackDate = new Date()): Date => {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return isValid(date) ? date : fallbackDate;
};

export const renderFullDate = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateFormat);
};

export const renderCzIsoDate = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, czIsoDateFormat);
};

export const renderTournamentDate = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    if (date.getFullYear() === new Date().getFullYear())
        return capitalizeFirstLetter(format(date, dateShortFormat, { locale: cs }));
    return format(date, fullDateShortFormat);
};

export const renderFullDateWithHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateWithHoursShortFormat);
};

export const renderFullDateShortWithHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, fullDateShortWithHoursShortFormat);
};

export const renderDateShortWithHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, dateShortWithHoursShortFormat);
};

export const renderHoursShort = (dateInput: Date | string): string => {
    const date = parseDateInput(dateInput);
    return format(date, hoursShortFormat);
};
