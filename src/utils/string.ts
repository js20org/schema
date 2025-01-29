export const isRegexMatch = (value: string, regex: RegExp): boolean => {
    return !!value.match(regex);
};

export const isInsideSizeLimit = (value: string, limit: number): boolean => {
    return value.length <= limit;
};
