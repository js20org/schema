import { removeElement } from '../../utils';
import { isArray, isNullOrUndefined, isObject } from '../../validation';

import { SchemaInvalidValueError } from '../errors';
import { isSchemaAnObject, isSchemaType } from '../helpers';

import {
    isValidAnyBySchema,
    isValidBooleanBySchema,
    isValidByEmptyObjectSchema,
    isValidClassInstanceBySchema,
    isValidDateBySchema,
    isValidEnumBySchema,
    isValidFunctionBySchema,
    isValidNullBySchema,
    isValidNumberBySchema,
    isValidStringBySchema,
} from '../schema-types';

import {
    ISchemaArray,
    ISchemaData,
    ISchemaObject,
    IValidatedSchema,
    SchemaType,
    IBooleanData,
    IClassInstanceData,
    IDateData,
    IEnumData,
    IFunctionData,
    INumberData,
    IOptionalObjectData,
    IStringData,
} from '../../types';

type SchemaErrorGetter = (fieldKeys: string[], reason: string) => Error;

const validateSchemaArray = (
    getError: SchemaErrorGetter,
    schema: ISchemaArray,
    value: any,
    fieldKeys: string[]
) => {
    const isValidArray = isArray(value);

    if (!isValidArray) {
        throw getError(fieldKeys, 'Expected value to be an array');
    }

    const valueArray = <any[]>value;
    const schemaItem = schema[0];

    for (let i = 0; i < valueArray.length; i++) {
        const item = valueArray[i];

        validateBySchemaInternal(getError, schemaItem, item, [
            ...fieldKeys,
            `[${i}]`,
        ]);
    }
};

const validateSchemaObject = (
    getError: SchemaErrorGetter,
    schema: ISchemaObject,
    value: any,
    fieldKeys: string[]
) => {
    const isValidObject = isObject(value);

    if (!isValidObject) {
        throw getError(fieldKeys, 'Expected value to be an object');
    }

    const valueObject = <Record<string, any>>value;

    const schemaKeys = Object.keys(schema);
    const valueKeys = Object.keys(valueObject);

    for (const key of schemaKeys) {
        const schemaField = schema[key];
        const valueField = valueObject[key];

        validateBySchemaInternal(getError, schemaField, valueField, [
            ...fieldKeys,
            key,
        ]);

        try {
            removeElement(valueKeys, key);
        } catch {}
    }

    const hasMoreValues = valueKeys.length > 0;

    if (hasMoreValues) {
        throw getError(fieldKeys, 'The object had more keys than the schema.');
    }
};

const getValidationResult = (schema: ISchemaData, value: any) => {
    switch (schema.type) {
        case SchemaType.ANY:
            return isValidAnyBySchema(schema);

        case SchemaType.NULL:
            return isValidNullBySchema(schema, value);

        case SchemaType.EMPTY_OBJECT:
            return isValidByEmptyObjectSchema(schema, value);

        case SchemaType.STRING:
            return isValidStringBySchema(<IStringData>schema, value);

        case SchemaType.NUMBER:
            return isValidNumberBySchema(<INumberData>schema, value);

        case SchemaType.DATE:
            return isValidDateBySchema(<IDateData>schema, value);

        case SchemaType.BOOLEAN:
            return isValidBooleanBySchema(<IBooleanData>schema, value);

        case SchemaType.CLASS_INSTANCE:
            return isValidClassInstanceBySchema(
                <IClassInstanceData>schema,
                value
            );

        case SchemaType.ENUM:
            return isValidEnumBySchema(<IEnumData>schema, value);

        case SchemaType.FUNCTION:
            return isValidFunctionBySchema(<IFunctionData>schema, value);

        default:
            throw new Error(`Unknown schema type: ${schema.type}`);
    }
};

const validateSchemaField = (
    getError: SchemaErrorGetter,
    schema: ISchemaData,
    value: any,
    fieldKeys: string[]
) => {
    const { isValid, reason } = getValidationResult(schema, value);

    if (!isValid) {
        throw getError(fieldKeys, reason);
    }
};

const validateSchemaOptionalObject = (
    getError: SchemaErrorGetter,
    schema: IOptionalObjectData<any>,
    value: any,
    fieldKeys: string[]
) => {
    const isNotSet = isNullOrUndefined(value);

    if (isNotSet) {
        return;
    }

    const { nextSchema } = schema;

    const isSchemaArray = isArray(nextSchema);
    const isSchemaObject = isSchemaAnObject(nextSchema);

    if (isSchemaArray) {
        return validateSchemaArray(
            getError,
            <ISchemaArray>nextSchema,
            value,
            fieldKeys
        );
    } else if (isSchemaObject) {
        return validateSchemaObject(
            getError,
            <ISchemaObject>nextSchema,
            value,
            fieldKeys
        );
    }

    throw new Error('Optional schema must be an array or object');
};

const validateBySchemaInternal = (
    getError: SchemaErrorGetter,
    schema: any,
    value: any,
    fieldKeys: string[]
) => {
    const isOptionalObject = isSchemaType(schema, SchemaType.OPTIONAL_OBJECT);
    const isAny = isSchemaType(schema, SchemaType.ANY);
    const isSchemaArray = isArray(schema);
    const isSchemaObject = isSchemaAnObject(schema);

    if (isAny) {
        return;
    } else if (isOptionalObject) {
        return validateSchemaOptionalObject(getError, schema, value, fieldKeys);
    } else if (isSchemaArray) {
        return validateSchemaArray(
            getError,
            <ISchemaArray>schema,
            value,
            fieldKeys
        );
    } else if (isSchemaObject) {
        return validateSchemaObject(
            getError,
            <ISchemaObject>schema,
            value,
            fieldKeys
        );
    } else {
        return validateSchemaField(
            getError,
            <ISchemaData>schema,
            value,
            fieldKeys
        );
    }
};

export const validateBySchema = (schema: IValidatedSchema, value: any) => {
    const actualSchema = schema.getSchema();

    const getSchemaError = (fieldKeys: string[], reason: string) =>
        new SchemaInvalidValueError(
            {
                schema: actualSchema,
                fieldKeys,
                reason,
            },
            value
        );

    validateBySchemaInternal(getSchemaError, actualSchema, value, []);
};
