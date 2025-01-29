import { isNullOrUndefined, isValidClassInstance } from '../../validation';
import { getClassNameFromType } from '../../utils';

import { getSchemaBase } from '../helpers';
import { IClassInstanceData, IValidationResult, SchemaType } from '../../types';

export class ClassInstanceType<T> {
    private data: IClassInstanceData;

    constructor(label: string, classType: any) {
        this.data = {
            ...getSchemaBase(SchemaType.CLASS_INSTANCE, label),
            classType,
        };
    }

    public type() {
        return <T>(<unknown>this.data);
    }
}

export const isValidClassInstanceBySchema = (
    schema: IClassInstanceData,
    value: any
): IValidationResult => {
    const isUnset = isNullOrUndefined(value);

    if (isUnset) {
        return {
            isValid: false,
            reason: 'Value is null or undefined',
        };
    }

    const isValid = isValidClassInstance(value, schema.classType);

    if (!isValid) {
        const typeString = getClassNameFromType(schema.classType);

        return {
            isValid: false,
            reason: `Value is not of type "${typeString}"`,
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
