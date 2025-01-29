import { isString, isInteger, isNumber, isArray } from './type';
import { isInsideSizeLimit } from './string';

/* ----------------- GENERAL ----------------- */

export const isNullOrUndefined = (value: any): boolean => {
    return value === null || value === undefined;
};

/* ----------------- NUMBER ----------------- */

export const isValidInteger = (value: any): boolean => {
    const isNull = value === null || value === undefined;

    if (isNull) {
        return false;
    }

    return isInteger(value);
};

export const isValidNotNanNumber = (value: any): boolean => {
    if (isNumber(value)) {
        return !isNaN(value);
    } else {
        return false;
    }
};

/* ----------------- STRING ----------------- */

export const isValidNonEmptyString = (value: any): boolean => {
    const isEmpty = value === null || value === undefined;

    if (isEmpty) {
        return false;
    }

    if (isString(value)) {
        return value.length > 0;
    } else {
        return false;
    }
};

export const isValidStringInsideLimit = (value: any, limit: any): boolean => {
    return isString(value) && isInsideSizeLimit(value, limit);
};

export const isValidString = (value: any) => {
    return value !== undefined && typeof value === 'string';
};

/* ----------------- OBJECT ----------------- */

export const isValidClassInstance = <T extends Function>(
    value: any,
    type: T
): boolean => {
    const isEmpty = value === null || value === undefined;

    if (isEmpty) {
        return false;
    }

    return value instanceof type;
};

/* ----------------- ARRAY ----------------- */

export const isValidNonEmptyArray = (value: any): boolean => {
    return isArray(value) && value.length > 0;
};

/* ----------------- DATE ----------------- */

export const isValidDate = (value: any): boolean => {
    if (!isValidInteger(value)) {
        return false;
    }

    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
};

export const isValidDateInstance = (date: any): boolean => {
    return (
        !!date &&
        typeof date === 'object' &&
        date instanceof Date &&
        !isNaN(date.getTime())
    );
};
