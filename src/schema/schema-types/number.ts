import {
    isNullOrUndefined,
    isValidInteger,
    isValidNotNanNumber,
} from '../../validation';

import { getSchemaBase } from '../helpers';
import { INumberData, IValidationResult, SchemaType } from '../../types';

export class NumberType {
    private data: INumberData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.NUMBER, label),
            areDecimalsAllowed: true,
            isOptional: false,
        };
    }

    public optional() {
        this.data.isOptional = true;
        return this;
    }

    public noDecimals() {
        this.data.areDecimalsAllowed = false;
        return this;
    }

    public min(value: number) {
        this.data.min = value;
        return this;
    }

    public max(value: number) {
        this.data.max = value;
        return this;
    }

    public type() {
        return <number>(<unknown>this.data);
    }
}

export const isValidNumberBySchema = (
    schema: INumberData,
    value: any
): IValidationResult => {
    const { isOptional, areDecimalsAllowed, min, max } = schema;
    const isUnset = isNullOrUndefined(value);

    if (isUnset) {
        return {
            isValid: isOptional,
            reason: 'Value is null or undefined',
        };
    }

    const isNumber = isValidNotNanNumber(value);

    if (!isNumber) {
        return {
            isValid: false,
            reason: 'Value is not a number or it is Number.NaN',
        };
    }

    const hasValidDecimals = areDecimalsAllowed || isValidInteger(value);

    if (!hasValidDecimals) {
        return {
            isValid: false,
            reason: 'Expected an integer value without decimals',
        };
    }

    const numberValue = <number>value;

    const isValidByMin = min === undefined || numberValue >= min;
    const isValidByMax = max === undefined || numberValue <= max;

    const isInRange = isValidByMin && isValidByMax;

    if (!isInRange) {
        const minString = min === undefined ? '-' : min;
        const maxString = max === undefined ? '-' : max;

        return {
            isValid: false,
            reason: `Value is not in range (min: ${minString}, max: ${maxString})`,
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};

export const isSchemaNumberFieldInteger = (schema: any) => {
    const { areDecimalsAllowed } = schema as INumberData;
    const hasBoolean = areDecimalsAllowed !== undefined;

    if (hasBoolean) {
        return !areDecimalsAllowed;
    } else {
        throw new Error('The provided item was not a valid number field.');
    }
};
