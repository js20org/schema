import { isValidEnumValue } from '~/utils';

enum Foobar {
    test = '1',
    test2 = '2'
}

describe('[isValidEnumValue]', () => {
    it('Works as it should', () => {
        expect(isValidEnumValue(Foobar, Foobar.test)).toBe(true);
        expect(isValidEnumValue(Foobar, Foobar.test2)).toBe(true);

        expect(isValidEnumValue(Foobar, '1')).toBe(true);
        expect(isValidEnumValue(Foobar, '2')).toBe(true);

        expect(isValidEnumValue(Foobar, 'foo')).toBe(false);
        expect(isValidEnumValue(Foobar, 1)).toBe(false);
    });
});
