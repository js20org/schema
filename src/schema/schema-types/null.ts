import { isNullOrUndefined } from '../../utils';

import { getSchemaBase } from '../helpers';
import { ISchemaData, IValidationResult, SchemaType } from '../../types';

export class NullType {
    private data: ISchemaData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.NULL, label),
        };
    }

    public type() {
        return <null | undefined>(<unknown>this.data);
    }
}

export const isValidNullBySchema = (
    _schema: any,
    value: any
): IValidationResult => {
    const isNull = isNullOrUndefined(value);

    if (!isNull) {
        return {
            isValid: false,
            reason: 'Value is not null or undefined',
        };
    }

    return {
        isValid: true,
        reason: '',
    };
};
