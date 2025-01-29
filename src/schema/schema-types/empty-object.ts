import { isObject } from '../../validation';
import { getSchemaBase } from '../helpers';
import { ISchemaData, IValidationResult, SchemaType } from '../../types';

export class EmptyObjectType {
    private data: ISchemaData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.EMPTY_OBJECT, label),
        };
    }

    public type() {
        return <Record<string, any>>(<unknown>this.data);
    }
}

export const isValidByEmptyObjectSchema = (
    _schema: any,
    value: any
): IValidationResult => {
    const isEmpty = isObject(value) && Object.keys(value).length === 0;

    if (!isEmpty) {
        return {
            isValid: false,
            reason: 'Value is not an empty object',
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
