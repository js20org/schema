import {
    isRegexMatch,
    isInsideSizeLimit,
} from '~/utils';

describe('[isRegexMatch]', () => {
    it('Works as it should', () => {
        expect(isRegexMatch('0123', /[0-9][0-9][0-9][0-9]/)).toBe(true);
        expect(isRegexMatch('0a123', /[0-9][0-9][0-9][0-9]/)).toBe(false);
    });
});

describe('[isInsideSizeLimit]', () => {
    it('Works as it should', () => {
        expect(isInsideSizeLimit('abc', 2)).toBe(false);
        expect(isInsideSizeLimit('abc', 3)).toBe(true);
        expect(isInsideSizeLimit('abc', 4)).toBe(true);
    });
});
