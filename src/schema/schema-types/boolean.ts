import { isBoolean, isNullOrUndefined } from '../../validation';

import { getSchemaBase } from '../helpers';
import { IBooleanData, IValidationResult, SchemaType } from '../../types';

export class BooleanType {
    private data: IBooleanData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.BOOLEAN, label),
            isOptional: false,
        };
    }

    public optional() {
        this.data.isOptional = true;
        return this;
    }

    public type() {
        return <boolean>(<unknown>this.data);
    }
}

export const isValidBooleanBySchema = (
    schema: IBooleanData,
    value: any
): IValidationResult => {
    const { isOptional } = schema;
    const isUnset = isNullOrUndefined(value);

    if (isUnset) {
        return {
            isValid: isOptional,
            reason: 'Value is null or undefined',
        };
    }

    const isValueBoolean = isBoolean(value);

    if (!isValueBoolean) {
        return {
            isValid: false,
            reason: 'Value is not a boolean',
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
