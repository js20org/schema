import { isNullOrUndefined, isString, isValidEnumValue } from '../../utils';
import { getSchemaBase } from '../helpers';
import { IEnumData, IValidationResult, SchemaType } from '../../types';

export class EnumType<T> {
    private data: IEnumData;

    constructor(label: string, enumType: any) {
        this.data = {
            ...getSchemaBase(SchemaType.ENUM, label),
            enumType,
            isOptional: false,
        };
    }

    public optional() {
        this.data.isOptional = true;
        return this;
    }

    public type() {
        return <T>(<unknown>this.data);
    }
}

export const isValidEnumBySchema = (
    schema: IEnumData,
    value: any
): IValidationResult => {
    const { isOptional, enumType } = schema;
    const isUnset = isNullOrUndefined(value);

    if (isUnset) {
        return {
            isValid: isOptional,
            reason: 'Value is null or undefined',
        };
    }

    const isValueString = isString(value);

    if (!isValueString) {
        return {
            isValid: false,
            reason: 'Value is not a string',
        };
    }

    const isValid = isValidEnumValue(enumType, value);

    if (!isValid) {
        return {
            isValid: false,
            reason: `Value is not a valid enum value`,
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
