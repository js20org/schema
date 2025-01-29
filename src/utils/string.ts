export const isRegexMatch = (value: string, regex: RegExp): boolean => {
    return !!value.match(regex);
};
