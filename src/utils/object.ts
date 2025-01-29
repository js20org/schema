import { isArray, isObject } from './type';

const getFrozenCloneArray = (value: any[]) => {
    const result = [];

    for (const item of value) {
        result.push(getFrozenClone(item));
    }

    Object.freeze(result);
    return result;
};

const getFrozenCloneObject = (object: Record<string, any>) => {
    const result: any = {};

    for (const key of Object.keys(object)) {
        result[key] = getFrozenClone(object[key]);
    }

    Object.freeze(result);
    return result;
};

export const getFrozenClone = <T>(value: T): T => {
    const isValueObject = isObject(value);
    const isValueArray = isArray(value);

    if (isValueObject) {
        return <T>getFrozenCloneObject(value as any);
    } else if (isValueArray) {
        return <T>(<unknown>getFrozenCloneArray(<any[]>(<unknown>value)));
    } else {
        return value;
    }
};
