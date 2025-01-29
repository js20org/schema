import { isValidString } from '~/utils';

describe('[isValidString]', () => {
    it('Works as it should', () => {
        expect(isValidString(false)).toBe(false);
        expect(isValidString(1)).toBe(false);
        expect(isValidString({})).toBe(false);

        expect(isValidString('a')).toBe(true);
        expect(isValidString('')).toBe(true);
    });
});
