import {
    AnyType,
    BooleanType,
    ClassInstanceType,
    DateType,
    EmptyObjectType,
    EnumType,
    FunctionType,
    NullType,
    NumberType,
    OptionalType,
    StringType,
} from './schema-types';

export const sEmptyObject = () => new EmptyObjectType('EmptyObject');
export const sOptional = <T>(nextSchema: T) =>
    new OptionalType('Optional', nextSchema);

export const sNull = () => new NullType('Null');
export const sAny = () => new AnyType('Any');

export const sString = () => new StringType('String');
export const sStringShort = () => new StringType('StringShort').maxLength(100);
export const sStringMedium = () =>
    new StringType('StringMedium').maxLength(1000);
export const sStringLong = () => new StringType('StringLong').maxLength(10000);
export const sStringInteger = () =>
    new StringType('StringInteger').integerString();
export const sStringUuid = () =>
    new StringType('StringUuid').matches(
        //https://stackoverflow.com/a/13653180
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

export const sBoolean = () => new BooleanType('Boolean');

export const sNumber = () => new NumberType('Number');
export const sNumberInRange = (min: number, max: number) =>
    new NumberType('NumberInRange').min(min).max(max);

export const sInteger = () => new NumberType('Integer').noDecimals();
export const sIntegerInRange = (min: number, max: number) =>
    new NumberType('IntegerInRange').noDecimals().min(min).max(max);

export const sDate = () => new DateType('Date');

export const sClass = <T>(classType: any) =>
    new ClassInstanceType<T>('Class', classType);

export const sEnum = <T>(enumType: any) => new EnumType<T>('Enum', enumType);

export const sFunction = () => new FunctionType('Function');
