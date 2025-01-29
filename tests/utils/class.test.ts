import { getClassNameFromType } from '~/utils';

describe('[getClassNameFromType]', () => {
    it('Works as it should', () => {
        class FooBar {};
        expect(getClassNameFromType(null)).toBe(null);
        expect(getClassNameFromType(1)).toBe(null);
        expect(getClassNameFromType('foo')).toBe(null);
        expect(getClassNameFromType({})).toBe(null);
        expect(getClassNameFromType(FooBar)).toBe('FooBar');
    });
});
