export const isValidEnumValue = (enumType: any, value: any) => {
    return Object.values(enumType).includes(value);
};
