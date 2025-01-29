import { getSchemaBase } from '../helpers';
import { IOptionalObjectData, SchemaType } from '../../types';

export class OptionalType<T> {
    private data: IOptionalObjectData<T>;

    constructor(label: string, nextSchema: T) {
        this.data = {
            ...getSchemaBase(SchemaType.OPTIONAL_OBJECT, label),
            nextSchema,
        };
    }

    public type() {
        return <T>(<unknown>this.data);
    }
}
