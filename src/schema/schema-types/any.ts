import { getSchemaBase } from '../helpers';
import { ISchemaData, IValidationResult, SchemaType } from '../../types';

export class AnyType {
    private data: ISchemaData;

    constructor(label: string) {
        this.data = {
            ...getSchemaBase(SchemaType.ANY, label),
        };
    }

    public type() {
        return <any>(<unknown>this.data);
    }
}

export const isValidAnyBySchema = (_schema: any): IValidationResult => {
    return {
        isValid: true,
        reason: '',
    };
};
