import {
    IOptionalData,
    ISchemaData,
    IValidatedSchema,
    SchemaType,
} from '../types';

import { getFrozenClone } from '../utils';
import { isObject, isString } from '../utils';

export const getSchemaBase = (
    schemaType: SchemaType,
    label: string
): ISchemaData => ({
    isSchemaField: true,
    label,
    type: schemaType,
});

export class ValidatedSchema<T> implements IValidatedSchema {
    private schema: T;

    constructor(schema: T) {
        this.schema = getFrozenClone(schema);
    }

    getSchema() {
        return this.schema;
    }

    getSchemaSection<U>(sectionGetter: (schema: T) => U) {
        const section = sectionGetter(this.schema);
        return new ValidatedSchema<U>(section);
    }
}

export const isSchemaAnObject = (schema: any) => {
    return isObject(schema) && !schema.isSchemaField;
};

export const isSameSchemaBase = (a: any, b: any) => {
    const isValid = (data: ISchemaData) =>
        isObject(data) &&
        data.label &&
        isString(data.label) &&
        data.label.length > 0;

    const isValidA = isValid(a);
    const isValidB = isValid(b);

    if (!isValidA) {
        throw new Error('First argument is not a valid schema.');
    }

    if (!isValidB) {
        throw new Error('Second argument is not a valid schema.');
    }

    return (a as ISchemaData).label === (b as ISchemaData).label;
};

export const getSchemaFieldType = (schema: any) => {
    const { type } = schema as ISchemaData;

    if (!type) {
        throw new Error('The provided value was not a valid schema field');
    }

    return type;
};

export const isSchemaType = (schema: any, expectedType: SchemaType) => {
    try {
        const type = getSchemaFieldType(schema);
        return type === expectedType;
    } catch {
        return false;
    }
};

export const isSchemaFieldOptional = (schema: any) => {
    const { isOptional } = schema as IOptionalData;
    const hasBoolean = isOptional !== undefined;

    if (hasBoolean) {
        return isOptional;
    } else {
        return false;
    }
};

export const getPartialSchema = (schema: any, partialKeys: string[]) => {
    const result: any = {};

    for (const key of Object.keys(schema)) {
        const isIncluded = partialKeys.includes(key);

        if (isIncluded) {
            result[key] = schema[key];
        }
    }

    return result;
};
