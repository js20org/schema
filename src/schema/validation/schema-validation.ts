import {
    ISchemaArray,
    ISchemaData,
    ISchemaObject,
    SchemaType,
    IOptionalObjectData,
} from '../../types';

import { isArray, isObject } from '../../validation';
import { SchemaInvalidError } from '../errors';
import { isSchemaAnObject, isSchemaType, ValidatedSchema } from '../helpers';

type SchemaErrorGetter = (fieldKeys: string[], reason: string) => Error;

const validateSchemaArray = (
    getError: SchemaErrorGetter,
    schema: ISchemaArray,
    fieldKeys: string[]
) => {
    const hasSingleItem = schema.length === 1;

    if (!hasSingleItem) {
        throw getError(fieldKeys, 'Expected array to be a single element.');
    }

    return validateSchemaInternal(getError, schema[0], [...fieldKeys, '[0]']);
};

const validateSchemaObject = (
    getError: SchemaErrorGetter,
    schema: ISchemaObject,
    fieldKeys: string[]
) => {
    const isEmpty = Object.keys(schema).length === 0;

    if (isEmpty) {
        throw getError(fieldKeys, 'Expected non-empty object.');
    }

    for (const [key, value] of Object.entries(schema)) {
        validateSchemaInternal(getError, value, [...fieldKeys, key]);
    }
};

const validateSchemaField = (
    getError: SchemaErrorGetter,
    schema: ISchemaData,
    fieldKeys: string[]
) => {
    const isNotObject = !isObject(schema);

    if (isNotObject) {
        throw getError(
            fieldKeys,
            'The schema field was not an object, did you forget to call type()?'
        );
    }

    if (!schema.type) {
        throw getError(
            fieldKeys,
            'No "type" field present, the field is misconfigured.'
        );
    }

    const isKnownType = Object.values(SchemaType).some(
        (t) => schema.type === t
    );

    if (!isKnownType) {
        throw getError(fieldKeys, `Unknown field type "${schema.type}".`);
    }
};

const validateOptionalInternal = (
    getError: SchemaErrorGetter,
    schema: IOptionalObjectData<any>,
    fieldKeys: string[]
) => {
    const { nextSchema } = schema;

    const isSchemaArray = isArray(nextSchema);
    const isSchemaObject = isSchemaAnObject(nextSchema);

    if (isSchemaArray) {
        return validateSchemaArray(
            getError,
            <ISchemaArray>nextSchema,
            fieldKeys
        );
    } else if (isSchemaObject) {
        return validateSchemaObject(
            getError,
            <ISchemaObject>nextSchema,
            fieldKeys
        );
    }

    throw getError(
        fieldKeys,
        'An optional type can only be an array or object.'
    );
};

const validateSchemaInternal = (
    getError: SchemaErrorGetter,
    schema: any,
    fieldKeys: string[]
) => {
    const isOptionalObject = isSchemaType(schema, SchemaType.OPTIONAL_OBJECT);
    const isSchemaArray = isArray(schema);
    const isSchemaObject = isSchemaAnObject(schema);

    if (isOptionalObject) {
        return validateOptionalInternal(getError, schema, fieldKeys);
    } else if (isSchemaArray) {
        return validateSchemaArray(getError, <ISchemaArray>schema, fieldKeys);
    } else if (isSchemaObject) {
        return validateSchemaObject(getError, <ISchemaObject>schema, fieldKeys);
    } else {
        return validateSchemaField(getError, <ISchemaData>schema, fieldKeys);
    }
};

export const getValidatedSchema = <T>(schema: T) => {
    const getSchemaError = (fieldKeys: string[], reason: string) =>
        new SchemaInvalidError({
            schema,
            fieldKeys,
            reason,
        });

    validateSchemaInternal(getSchemaError, schema, []);
    return new ValidatedSchema(schema);
};
