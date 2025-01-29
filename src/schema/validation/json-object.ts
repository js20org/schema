import {
    isArray,
    isBoolean,
    isNullOrUndefined,
    isNumber,
    isObject,
    isValidDateInstance,
    isValidString,
} from '../../validation';

import {
    ISchemaArray,
    ISchemaObject,
    IValidatedSchema,
    SchemaType,
    IOptionalObjectData,
} from '../../types';

import { SchemaInvalidValueError } from '../errors';
import { isSchemaAnObject, isSchemaType } from '../helpers';

type SchemaErrorGetter = (fieldKeys: string[], reason: string) => Error;

const getArrayInternal = (
    getError: SchemaErrorGetter,
    schema: ISchemaArray,
    value: any,
    fieldKeys: string[]
) => {
    const isValidArray = isArray(value);

    if (!isValidArray) {
        throw getError(fieldKeys, 'Expected value to be an array');
    }

    const resultArray = [];

    const valueArray = <any[]>value;
    const schemaItem = schema[0];

    for (let i = 0; i < valueArray.length; i++) {
        const item = valueArray[i];
        const resultItem = getInternal(getError, schemaItem, item, [
            ...fieldKeys,
            `[${i}]`,
        ]);

        const shouldSet = resultItem !== undefined;

        if (shouldSet) {
            resultArray.push(resultItem);
        }
    }

    return resultArray;
};

const getObjectInternal = (
    getError: SchemaErrorGetter,
    schema: ISchemaObject,
    value: any,
    fieldKeys: string[]
) => {
    const isValidObject = isObject(value);

    if (!isValidObject) {
        throw getError(fieldKeys, 'Expected value to be an object');
    }

    const resultObject = {};
    const valueObject = <Record<string, any>>value;

    const schemaKeys = Object.keys(schema);

    for (const key of schemaKeys) {
        const schemaField = schema[key];
        const valueField = valueObject[key];

        const value = getInternal(getError, schemaField, valueField, [
            ...fieldKeys,
            key,
        ]);

        const shouldSet = value !== undefined;

        if (shouldSet) {
            resultObject[key] = value;
        }
    }

    return resultObject;
};

const getFieldInternal = (value: any) => {
    const isValueString = isValidString(value);
    const isValueBoolean = isBoolean(value);
    const isValueNumber = isNumber(value);
    const isValueDate = isValidDateInstance(value);

    const isValid =
        isValueString || isValueBoolean || isValueNumber || isValueDate;

    const isNull = value === null;

    if (isValid) {
        return value;
    } else if (isNull) {
        return null;
    } else {
        return undefined;
    }
};

const getOptionalObjectInternal = (
    getError: SchemaErrorGetter,
    schema: IOptionalObjectData<any>,
    value: any,
    fieldKeys: string[]
) => {
    const isNotSet = isNullOrUndefined(value);

    if (isNotSet) {
        return value === null ? null : undefined;
    }

    const { nextSchema } = schema;

    const isSchemaArray = isArray(nextSchema);
    const isSchemaObject = isSchemaAnObject(nextSchema);

    if (isSchemaArray) {
        return getArrayInternal(
            getError,
            <ISchemaArray>nextSchema,
            value,
            fieldKeys
        );
    } else if (isSchemaObject) {
        return getObjectInternal(
            getError,
            <ISchemaObject>nextSchema,
            value,
            fieldKeys
        );
    }

    throw new Error('Optional schema must be an array or object');
};

const getInternal = (
    getError: SchemaErrorGetter,
    schema: any,
    value: any,
    fieldKeys: string[]
) => {
    const isOptionalObject = isSchemaType(schema, SchemaType.OPTIONAL_OBJECT);
    const isSchemaArray = isArray(schema);
    const isSchemaObject = isSchemaAnObject(schema);
    const isSchemaAny = isSchemaType(schema, SchemaType.ANY);

    if (isSchemaAny) {
        return value;
    } else if (isOptionalObject) {
        return getOptionalObjectInternal(getError, schema, value, fieldKeys);
    } else if (isSchemaArray) {
        return getArrayInternal(
            getError,
            <ISchemaArray>schema,
            value,
            fieldKeys
        );
    } else if (isSchemaObject) {
        return getObjectInternal(
            getError,
            <ISchemaObject>schema,
            value,
            fieldKeys
        );
    } else {
        return getFieldInternal(value);
    }
};

export const getJsonContentBySchema = <T>(
    schema: IValidatedSchema,
    value: T
): Record<string, any> => {
    const actualSchema = schema.getSchema();
    const isEmptyObjectSchema = isSchemaType(
        actualSchema,
        SchemaType.EMPTY_OBJECT
    );

    if (isEmptyObjectSchema) {
        return {};
    }

    const isSchemaObject = isSchemaAnObject(actualSchema);

    if (!isSchemaObject) {
        throw new Error(
            'Expected schema to be an object but got something else.'
        );
    }

    const isValueObject = value && isObject(value);

    if (!isValueObject) {
        throw new Error(
            'Expected value to be an object but got something else.'
        );
    }

    const getSchemaError = (fieldKeys: string[], reason: string) =>
        new SchemaInvalidValueError(
            {
                schema: actualSchema,
                fieldKeys,
                reason,
            },
            value
        );

    return getObjectInternal(getSchemaError, actualSchema, value, []);
};
