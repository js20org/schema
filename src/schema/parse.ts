import { INumberData, ISchemaData, ISchemaIssue, SchemaType } from '../types';
import { isIntegerString } from '../utils';
import { SchemaErrorBase } from './errors';

export class SchemaInvalidFieldError extends SchemaErrorBase {
    constructor(issue: ISchemaIssue) {
        super('[Invalid schema] The schema is not valid.', issue);
    }
}

export const getParsedSchemaValue = (field: any, value: any) => {
    const schemaField = field as ISchemaData;

    if (!schemaField.isSchemaField) {
        throw new SchemaInvalidFieldError({
            schema: field,
            fieldKeys: [],
            reason: 'Not a valid schema field.',
        });
    }

    const numberField = field as INumberData;
    const isIntegerSchema =
        numberField.type === SchemaType.NUMBER &&
        !numberField.areDecimalsAllowed;

    const isIntegerValue = isIntegerString(value);
    const shouldConvertToInteger = isIntegerValue && isIntegerSchema;

    if (shouldConvertToInteger) {
        return parseInt(value);
    } else {
        return value;
    }
};
