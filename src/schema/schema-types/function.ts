import { isFunction, isNullOrUndefined } from '../../validation';

import { getSchemaBase } from '../helpers';
import { IFunctionData, IValidationResult, SchemaType } from '../../types';

export class FunctionType {
    private data: IFunctionData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.FUNCTION, label),
            isOptional: false,
        };
    }

    public optional() {
        this.data.isOptional = true;
        return this;
    }

    public type() {
        return <(...args: any) => any>(<unknown>this.data);
    }
}

export const isValidFunctionBySchema = (
    schema: IFunctionData,
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

    const isValueFunction = isFunction(value);

    if (!isValueFunction) {
        return {
            isValid: false,
            reason: 'Value is not a function',
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
