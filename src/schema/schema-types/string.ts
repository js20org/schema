import {
    isNullOrUndefined,
    isIntegerString,
    isValidString,
} from '../../validation';

import { IStringData, IValidationResult, SchemaType } from '../../types';
import { isInsideSizeLimit, isRegexMatch } from '../../utils';
import { getSchemaBase } from '../helpers';

export class StringType {
    private data: IStringData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.STRING, label),
            isContentInteger: false,
            isOptional: false,
            isEmptyAllowed: true,
        };
    }

    public optional() {
        this.data.isOptional = true;
        return this;
    }

    public nonEmpty() {
        this.data.isEmptyAllowed = false;
        return this;
    }

    public matches(regex: RegExp) {
        this.data.matchesRegex = regex;
        return this;
    }

    public maxLength(value: number) {
        this.data.maxLength = value;
        return this;
    }

    public integerString() {
        this.data.isContentInteger = true;
        return this;
    }

    public type() {
        return <string>(<unknown>this.data);
    }
}

export const isValidStringBySchema = (
    schema: IStringData,
    value: any
): IValidationResult => {
    const isUnset = isNullOrUndefined(value);

    if (isUnset) {
        return {
            isValid: schema.isOptional,
            reason: 'Value is null or undefined',
        };
    }

    const isString = isValidString(value);

    if (!isString) {
        return {
            isValid: false,
            reason: 'Value is not a string',
        };
    }

    const stringValue = <string>value;

    const { isEmptyAllowed, maxLength, matchesRegex, isContentInteger } =
        schema;

    const isInvalidEmpty = !isEmptyAllowed && stringValue.length === 0;

    if (isInvalidEmpty) {
        return {
            isValid: false,
            reason: 'Value is empty',
        };
    }

    const isValidSize =
        maxLength === undefined || isInsideSizeLimit(stringValue, maxLength);

    if (!isValidSize) {
        return {
            isValid: false,
            reason: `Value is larger than max-length ${maxLength}`,
        };
    }

    const isValidByRegex =
        matchesRegex === undefined || isRegexMatch(stringValue, matchesRegex);

    if (!isValidByRegex) {
        return {
            isValid: false,
            reason: 'Value does not match the regex',
        };
    }

    const isInvalidIntegerString =
        isContentInteger && !isIntegerString(stringValue);

    if (isInvalidIntegerString) {
        return {
            isValid: false,
            reason: 'Value is not an integer string',
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};

export const getSchemaStringFieldMaxLength = (schema: any): number | null => {
    const { maxLength } = schema as IStringData;
    const hasMaxLenght = maxLength !== undefined;

    if (hasMaxLenght) {
        return maxLength;
    } else {
        return null;
    }
};
