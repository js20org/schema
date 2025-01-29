export enum SchemaType {
    ANY = 'any',
    NULL = 'null',
    EMPTY_OBJECT = 'empty-object',
    OPTIONAL_OBJECT = 'optional-object',
    STRING = 'string',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    CLASS_INSTANCE = 'class-instance',
    ENUM = 'enum',
    FUNCTION = 'function',
}

export interface ISchemaData {
    isSchemaField: true;
    label: string;
    type: SchemaType;
}

export type ISchemaArray = ISchemaData[];
export type ISchemaObject = Record<string, ISchemaData | any>;

export interface IValidationResult {
    isValid: boolean;
    reason: string;
}

export interface ISchemaIssue {
    schema: any;
    fieldKeys: string[];
    reason: string;
}

export interface IOptionalData {
    isOptional: boolean;
}

export interface IValidatedSchema {
    getSchema: () => any;
}

export interface INumberData extends ISchemaData, IOptionalData {
    areDecimalsAllowed: boolean;
    min?: number;
    max?: number;
}

export interface IStringData extends ISchemaData, IOptionalData {
    isEmptyAllowed: boolean;
    isContentInteger: boolean;
    maxLength?: number;
    matchesRegex?: RegExp;
}

export interface IOptionalObjectData<T> extends ISchemaData {
    nextSchema: T;
}

export interface IEnumData extends ISchemaData, IOptionalData {
    enumType: any;
}

export interface IClassInstanceData extends ISchemaData {
    classType: any;
}

export type IBooleanData = ISchemaData & IOptionalData;
export type IFunctionData = ISchemaData & IOptionalData;
export type IDateData = IOptionalData & ISchemaData;