import { ISchemaIssue } from '~/types';
import { SchemaErrorBase } from '~/index';

const getPrettyJson = (object: Record<string, any>) => {
    return JSON.stringify(object, null, 4);
};

const getMessage = (message: string, issue: ISchemaIssue) => {
    const { fieldKeys, schema, reason } = issue;

    const hasKeys = fieldKeys.length > 0;
    const keyString = hasKeys ? fieldKeys.join('.') : '[root]';
    const schemaJson = getPrettyJson(schema);

    return `${message} ${reason}\nField: ${keyString}\nSchema:\n${schemaJson}`;
};

export const getErrorMessage = (error: any) => {
    const isSchemaError = error instanceof SchemaErrorBase;

    if (!isSchemaError) {
        return error.message;
    }

    const schemaError = error as SchemaErrorBase;
    return getMessage(schemaError.message, schemaError.issue)
};
