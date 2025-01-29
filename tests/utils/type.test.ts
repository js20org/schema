import {
    isObject,
    isArray,
    isString,
    isInteger,
    isNumber,
    isBoolean,
    isFunction,
    isIntegerString,
} from '~/utils';

class Foobar {}

describe('[isObject]', () => {
    it('Works as it should', () => {
        expect(isObject(0)).toBe(false);
        expect(isObject(5)).toBe(false);
        expect(isObject(1e2)).toBe(false);
        expect(isObject(1.5)).toBe(false);
        expect(isObject('a')).toBe(false);
        expect(isObject('')).toBe(false);
        expect(isObject(false)).toBe(false);
        expect(isObject(() => {})).toBe(false);
        expect(isObject([])).toBe(false);
        expect(isObject([5])).toBe(false);
        expect(isObject({})).toBe(true);
        expect(isObject({ a: 5, d: { e: 3 } })).toBe(true);
        expect(isObject(new Foobar())).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(NaN)).toBe(false);
    });
});

describe('[isArray]', () => {
    it('Works as it should', () => {
        expect(isArray(0)).toBe(false);
        expect(isArray(5)).toBe(false);
        expect(isArray(1e2)).toBe(false);
        expect(isArray(1.5)).toBe(false);
        expect(isArray('a')).toBe(false);
        expect(isArray('')).toBe(false);
        expect(isArray(false)).toBe(false);
        expect(isArray(() => {})).toBe(false);
        expect(isArray([])).toBe(true);
        expect(isArray([5])).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isArray({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isArray(new Foobar())).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(undefined)).toBe(false);
        expect(isArray(NaN)).toBe(false);
    });
});

describe('[isString]', () => {
    it('Works as it should', () => {
        expect(isString(0)).toBe(false);
        expect(isString(5)).toBe(false);
        expect(isString(1e2)).toBe(false);
        expect(isString(1.5)).toBe(false);
        expect(isString('a')).toBe(true);
        expect(isString('')).toBe(true);
        expect(isString(false)).toBe(false);
        expect(isString(() => {})).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString([5])).toBe(false);
        expect(isString({})).toBe(false);
        expect(isString({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isString(new Foobar())).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString(NaN)).toBe(false);
    });
});

describe('[isNumber]', () => {
    it('Works as it should', () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(5)).toBe(true);
        expect(isNumber(1e2)).toBe(true);
        expect(isNumber(1.5)).toBe(true);
        expect(isNumber('a')).toBe(false);
        expect(isNumber('')).toBe(false);
        expect(isNumber(false)).toBe(false);
        expect(isNumber(() => {})).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber([5])).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isNumber(new Foobar())).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber(NaN)).toBe(true);
    });
});

describe('[isInteger]', () => {
    it('Works as it should', () => {
        expect(isInteger(0)).toBe(true);
        expect(isInteger(5)).toBe(true);
        expect(isInteger(1e2)).toBe(true);
        expect(isInteger(-0)).toBe(true);
        expect(isInteger(-5)).toBe(true);
        expect(isInteger(-5.5)).toBe(false);
        expect(isInteger(1.5)).toBe(false);
        expect(isInteger('a')).toBe(false);
        expect(isInteger('')).toBe(false);
        expect(isInteger(false)).toBe(false);
        expect(isInteger(() => {})).toBe(false);
        expect(isInteger([])).toBe(false);
        expect(isInteger([5])).toBe(false);
        expect(isInteger({})).toBe(false);
        expect(isInteger({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isInteger(new Foobar())).toBe(false);
        expect(isInteger(null)).toBe(false);
        expect(isInteger(undefined)).toBe(false);
        expect(isInteger(NaN)).toBe(false);
    });
});

describe('[isIntegerString]', () => {
    it('Works as it should', () => {
        expect(isIntegerString(0)).toBe(false);
        expect(isIntegerString(5)).toBe(false);
        expect(isIntegerString(1e2)).toBe(false);
        expect(isIntegerString(-0)).toBe(false);
        expect(isIntegerString(-5)).toBe(false);
        expect(isIntegerString(-5.5)).toBe(false);
        expect(isIntegerString(1.5)).toBe(false);
        expect(isIntegerString('a')).toBe(false);
        expect(isIntegerString('')).toBe(false);
        expect(isIntegerString('1.2')).toBe(false);
        expect(isIntegerString('-52.2')).toBe(false);
        expect(isIntegerString('-51245')).toBe(true);
        expect(isIntegerString('0')).toBe(true);
        expect(isIntegerString('240')).toBe(true);
        expect(isIntegerString(false)).toBe(false);
        expect(isIntegerString(() => {})).toBe(false);
        expect(isIntegerString([])).toBe(false);
        expect(isIntegerString([5])).toBe(false);
        expect(isIntegerString({})).toBe(false);
        expect(isIntegerString({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isIntegerString(new Foobar())).toBe(false);
        expect(isIntegerString(null)).toBe(false);
        expect(isIntegerString(undefined)).toBe(false);
        expect(isIntegerString(NaN)).toBe(false);
    });
});

describe('[isBoolean]', () => {
    it('Works as it should', () => {
        expect(isBoolean(0)).toBe(false);
        expect(isBoolean(5)).toBe(false);
        expect(isBoolean(1e2)).toBe(false);
        expect(isBoolean(1.5)).toBe(false);
        expect(isBoolean('a')).toBe(false);
        expect(isBoolean('')).toBe(false);
        expect(isBoolean(false)).toBe(true);
        expect(isBoolean(() => {})).toBe(false);
        expect(isBoolean([])).toBe(false);
        expect(isBoolean([5])).toBe(false);
        expect(isBoolean({})).toBe(false);
        expect(isBoolean({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isBoolean(new Foobar())).toBe(false);
        expect(isBoolean(null)).toBe(false);
        expect(isBoolean(undefined)).toBe(false);
        expect(isBoolean(NaN)).toBe(false);
    });
});

describe('[isFunction]', () => {
    it('Works as it should', () => {
        expect(isFunction(0)).toBe(false);
        expect(isFunction(5)).toBe(false);
        expect(isFunction(1e2)).toBe(false);
        expect(isFunction(1.5)).toBe(false);
        expect(isFunction('a')).toBe(false);
        expect(isFunction('')).toBe(false);
        expect(isFunction(false)).toBe(false);
        expect(isFunction(() => {})).toBe(true);
        expect(isFunction([])).toBe(false);
        expect(isFunction([5])).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction({ a: 5, d: { e: 3 } })).toBe(false);
        expect(isFunction(new Foobar())).toBe(false);
        expect(isFunction(null)).toBe(false);
        expect(isFunction(undefined)).toBe(false);
        expect(isFunction(NaN)).toBe(false);
    });
});
