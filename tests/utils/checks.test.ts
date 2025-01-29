import {
    isValidInteger,
    isValidNonEmptyString,
    isValidClassInstance,
    isValidDate,
    isValidDateInstance,
    isNullOrUndefined,
    isValidNotNanNumber,
    isValidStringInsideLimit,
    isValidNonEmptyArray,
} from '~/validation/checks';

describe('[isNullOrUndefined]', () => {
    it('Works as it should', () => {
        expect(isNullOrUndefined(null)).toBe(true);
        expect(isNullOrUndefined(undefined)).toBe(true);
        expect(isNullOrUndefined(1)).toBe(false);
        expect(isNullOrUndefined(1552)).toBe(false);
        expect(isNullOrUndefined(1.2)).toBe(false);
        expect(isNullOrUndefined('a')).toBe(false);
        expect(isNullOrUndefined({})).toBe(false);
    });
});

describe('[isValidInteger]', () => {
    it('Works as it should', () => {
        expect(isValidInteger(null)).toBe(false);
        expect(isValidInteger(undefined)).toBe(false);
        expect(isValidInteger(1)).toBe(true);
        expect(isValidInteger(1552)).toBe(true);
        expect(isValidInteger(NaN)).toBe(false);
        expect(isValidInteger(1.2)).toBe(false);
        expect(isValidInteger('a')).toBe(false);
        expect(isValidInteger({})).toBe(false);
    });
});

describe('[isValidNotNanNumber]', () => {
    it('Works as it should', () => {
        expect(isValidNotNanNumber(null)).toBe(false);
        expect(isValidNotNanNumber(undefined)).toBe(false);
        expect(isValidNotNanNumber(1)).toBe(true);
        expect(isValidNotNanNumber(1552)).toBe(true);
        expect(isValidNotNanNumber(NaN)).toBe(false);
        expect(isValidNotNanNumber(1.2)).toBe(true);
        expect(isValidNotNanNumber('a')).toBe(false);
        expect(isValidNotNanNumber({})).toBe(false);
    });
});

describe('[isValidNonEmptyString]', () => {
    it('Works as it should', () => {
        expect(isValidNonEmptyString(null)).toBe(false);
        expect(isValidNonEmptyString(undefined)).toBe(false);
        expect(isValidNonEmptyString('')).toBe(false);
        expect(isValidNonEmptyString('ab')).toBe(true);
        expect(isValidNonEmptyString('cde')).toBe(true);
        expect(isValidNonEmptyString(5)).toBe(false);
        expect(isValidNonEmptyString({})).toBe(false);
    });
});

describe('[isValidStringInsideLimit]', () => {
    it('Works as it should', () => {
        expect(isValidStringInsideLimit(null, 2)).toBe(false);
        expect(isValidStringInsideLimit(undefined, 2)).toBe(false);
        expect(isValidStringInsideLimit('', 2)).toBe(true);
        expect(isValidStringInsideLimit('ab', 2)).toBe(true);
        expect(isValidStringInsideLimit('cde', 2)).toBe(false);
        expect(isValidStringInsideLimit(5, 2)).toBe(false);
        expect(isValidStringInsideLimit({}, 2)).toBe(false);
    });
});

class Foobar {}
class Baz extends Foobar {}

describe('[isValidClassInstance]', () => {
    it('Works as it should', () => {
        const foobar = new Foobar();
        const baz = new Baz();

        expect(isValidClassInstance(null, Foobar)).toBe(false);
        expect(isValidClassInstance(undefined, Foobar)).toBe(false);
        expect(isValidClassInstance('', Foobar)).toBe(false);
        expect(isValidClassInstance(foobar, Foobar)).toBe(true);
        expect(isValidClassInstance(new Foobar(), Foobar)).toBe(true);
        expect(isValidClassInstance(new Baz(), Foobar)).toBe(true);
        expect(isValidClassInstance(baz, Foobar)).toBe(true);
        expect(isValidClassInstance(() => {}, Foobar)).toBe(false);
        expect(isValidClassInstance(Foobar, Foobar)).toBe(false);
        expect(isValidClassInstance({}, Foobar)).toBe(false);
    });
});

describe('[isValidNonEmptyArray]', () => {
    it('Works as it should', () => {
        expect(isValidNonEmptyArray(1)).toBe(false);
        expect(isValidNonEmptyArray(false)).toBe(false);
        expect(isValidNonEmptyArray('a')).toBe(false);
        expect(isValidNonEmptyArray([])).toBe(false);
        expect(isValidNonEmptyArray([2])).toBe(true);
        expect(isValidNonEmptyArray(['a', 'b'])).toBe(true);
    });
});

describe('[isValidDate]', () => {
    it('Works as it should', () => {
        expect(isValidDate(null)).toBe(false);
        expect(isValidDate(undefined)).toBe(false);
        expect(isValidDate(5)).toBe(true);
        expect(isValidDate(1555)).toBe(true);
        expect(isValidDate(15555)).toBe(true);
        expect(isValidDate(155555)).toBe(true);
        expect(isValidDate(1555555555555)).toBe(true);
        expect(isValidDate('a')).toBe(false);
        expect(isValidDate({})).toBe(false);
        expect(isValidDate(new Date())).toBe(false);
    });
});

describe('[isValidDateInstance]', () => {
    it('Works as it should', () => {
        expect(isValidDateInstance(null)).toBe(false);
        expect(isValidDateInstance(undefined)).toBe(false);
        expect(isValidDateInstance(5)).toBe(false);
        expect(isValidDateInstance(1555)).toBe(false);
        expect(isValidDateInstance(15555)).toBe(false);
        expect(isValidDateInstance(155555)).toBe(false);
        expect(isValidDateInstance(1555555555555)).toBe(false);
        expect(isValidDateInstance('a')).toBe(false);
        expect(isValidDateInstance({})).toBe(false);
        expect(isValidDateInstance(new Date())).toBe(true);
    });
});
