import { isRegexMatch } from './string';

const getBoolean = (condition: any) => !!condition;
const INTEGER_REGEX = /^\-?[0-9]+$/;

export const isArray = (value: any): boolean => {
    return getBoolean(Array.isArray(value));
};

export const isObject = (value: any): boolean => {
    if (isArray(value)) {
        return false;
    }

    return getBoolean(
        typeof value === 'object' && value?.constructor?.name === 'Object'
    );
};

export const isArrayOrObject = (value: any) => {
    return isArray(value) || isObject(value);
};

export const isString = (value: any): boolean => {
    return getBoolean(typeof value === 'string');
};

export const isNumber = (value: any): boolean => {
    return getBoolean(typeof value === 'number');
};

export const isInteger = (value: any): boolean => {
    const isOfTypeNumber = typeof value === 'number';

    if (!isOfTypeNumber) {
        return false;
    }

    const stringValue = value + '';
    return isRegexMatch(stringValue, INTEGER_REGEX);
};

export const isIntegerString = (value: any): boolean => {
    const isOfTypeString = isString(value);

    if (!isOfTypeString) {
        return false;
    }

    return isRegexMatch(value, INTEGER_REGEX);
};

export const isBoolean = (value: any): boolean => {
    return getBoolean(typeof value === 'boolean');
};

export const isFunction = (value: any): boolean => {
    return getBoolean(value && typeof value === 'function' && !isObject(value));
};
