import { IDateData, IValidationResult, SchemaType } from '../../types';
import { isNullOrUndefined, isValidDateInstance } from '../../utils';
import { getSchemaBase } from '../helpers';

export class DateType {
    private data: IDateData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.DATE, label),
            isOptional: false,
        };
    }

    public optional() {
        this.data.isOptional = true;
        return this;
    }

    public type() {
        return <Date>(<unknown>this.data);
    }
}

export const isValidDateBySchema = (
    schema: IDateData,
    value: any
): IValidationResult => {
    const { isOptional } = schema;
    const isUnset = isNullOrUndefined(value);

    if (isUnset) {
        return {
            isValid: isOptional,
            reason: 'Value is null or undefined',
        };
    }

    const isDate = isValidDateInstance(value);

    if (!isDate) {
        return {
            isValid: false,
            reason: 'Value is not a valid date',
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
