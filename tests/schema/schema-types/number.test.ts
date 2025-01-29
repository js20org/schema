import {
    isSchemaNumberFieldInteger,
    sInteger,
    sIntegerInRange,
    sNumber,
    sNumberInRange,
    sString,
} from '~/index';

import { NumberType, isValidNumberBySchema } from '~/schema/schema-types';

describe('[NumberType]', () => {
    it('Optional works', () => {
        const numberType = new NumberType('Number');
        expect((<any>numberType.type()).isOptional).toBe(false);

        numberType.optional();
        expect((<any>numberType.type()).isOptional).toBe(true);
    });

    it('No-decimals works', () => {
        const numberType = new NumberType('Number');
        expect((<any>numberType.type()).areDecimalsAllowed).toBe(true);

        numberType.noDecimals();
        expect((<any>numberType.type()).areDecimalsAllowed).toBe(false);
    });

    it('Min works', () => {
        const numberType = new NumberType('Number');
        expect((<any>numberType.type()).min).toBe(undefined);

        numberType.min(5);
        expect((<any>numberType.type()).min).toBe(5);
    });

    it('Max works', () => {
        const numberType = new NumberType('Number');
        expect((<any>numberType.type()).max).toBe(undefined);

        numberType.max(5);
        expect((<any>numberType.type()).max).toBe(5);
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidNumberBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidNumberBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidNumberBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new NumberType('Number').type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, {}, /is not a number/);
        expectIsInvalid(schema, () => {}, /not a number/);
        expectIsInvalid(schema, new NumberType('Number'), /not a number/);
        expectIsInvalid(schema, '', /not a number/);
        expectIsInvalid(schema, 'abc', /not a number/);
        expectIsInvalid(schema, false, /not a number/);
        expectIsInvalid(schema, Number.NaN, /not a number/);

        expectIsValid(schema, 1);
        expectIsValid(schema, 1123123132);
        expectIsValid(schema, 2e2);
        expectIsValid(schema, 0);
        expectIsValid(schema, 0.00125);
        expectIsValid(schema, -1);
        expectIsValid(schema, -1.2);
    });

    it('Optional works as it should', () => {
        const schema = new NumberType('Number').optional().type();

        expectIsInvalid(schema, {}, /is not a number/);
        expectIsInvalid(schema, () => {}, /not a number/);
        expectIsInvalid(schema, new NumberType('Number'), /not a number/);
        expectIsInvalid(schema, '', /not a number/);
        expectIsInvalid(schema, 'abc', /not a number/);
        expectIsInvalid(schema, false, /not a number/);
        expectIsInvalid(schema, Number.NaN, /not a number/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
        expectIsValid(schema, 1);
        expectIsValid(schema, 1123123132);
        expectIsValid(schema, 2e2);
        expectIsValid(schema, 0);
        expectIsValid(schema, 0.00125);
        expectIsValid(schema, -1);
        expectIsValid(schema, -1.2);
    });

    it('No-decimals works as it should', () => {
        const schema = new NumberType('Number').noDecimals().type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, {}, /is not a number/);
        expectIsInvalid(schema, () => {}, /not a number/);
        expectIsInvalid(schema, new NumberType('Number'), /not a number/);
        expectIsInvalid(schema, '', /not a number/);
        expectIsInvalid(schema, 'abc', /not a number/);
        expectIsInvalid(schema, false, /not a number/);
        expectIsInvalid(schema, Number.NaN, /not a number/);
        expectIsInvalid(schema, 0.00125, /integer value without decimals/);
        expectIsInvalid(schema, -1.2, /integer value without decimals/);

        expectIsValid(schema, 1);
        expectIsValid(schema, 1123123132);
        expectIsValid(schema, 2e2);
        expectIsValid(schema, 0);
        expectIsValid(schema, -1);
    });

    it('Min works as it should', () => {
        const schemaPositive = new NumberType('Number').min(5).type();

        expectIsInvalid(schemaPositive, null, /null or undefined/);
        expectIsInvalid(schemaPositive, undefined, /null or undefined/);
        expectIsInvalid(schemaPositive, {}, /is not a number/);
        expectIsInvalid(schemaPositive, 0, /not in range/);
        expectIsInvalid(schemaPositive, -2, /not in range/);
        expectIsInvalid(schemaPositive, 1, /not in range/);
        expectIsInvalid(schemaPositive, 4.8, /not in range/);
        expectIsInvalid(schemaPositive, 4.99999, /not in range/);

        expectIsValid(schemaPositive, 5);
        expectIsValid(schemaPositive, 10);
        expectIsValid(schemaPositive, 1010521);

        const schemaNegative = new NumberType('Number').min(-5).type();

        expectIsInvalid(schemaNegative, null, /null or undefined/);
        expectIsInvalid(schemaNegative, undefined, /null or undefined/);
        expectIsInvalid(schemaNegative, {}, /is not a number/);
        expectIsInvalid(schemaNegative, -1024, /not in range/);
        expectIsInvalid(schemaNegative, -6, /not in range/);
        expectIsInvalid(schemaNegative, -5.0001, /not in range/);

        expectIsValid(schemaNegative, -5);
        expectIsValid(schemaNegative, -4.76123);
        expectIsValid(schemaNegative, -3);
        expectIsValid(schemaNegative, 0);
        expectIsValid(schemaNegative, 512);
    });

    it('Max works as it should', () => {
        const schemaPositive = new NumberType('Number').max(5).type();

        expectIsInvalid(schemaPositive, null, /null or undefined/);
        expectIsInvalid(schemaPositive, undefined, /null or undefined/);
        expectIsInvalid(schemaPositive, {}, /is not a number/);
        expectIsInvalid(schemaPositive, 5.00001, /not in range/);
        expectIsInvalid(schemaPositive, 6, /not in range/);
        expectIsInvalid(schemaPositive, 10000, /not in range/);

        expectIsValid(schemaPositive, 5);
        expectIsValid(schemaPositive, 4.2312);
        expectIsValid(schemaPositive, 0);
        expectIsValid(schemaPositive, -2.2);

        const schemaNegative = new NumberType('Number').max(-5).type();

        expectIsInvalid(schemaNegative, null, /null or undefined/);
        expectIsInvalid(schemaNegative, undefined, /null or undefined/);
        expectIsInvalid(schemaNegative, {}, /is not a number/);
        expectIsInvalid(schemaNegative, -4.99999, /not in range/);
        expectIsInvalid(schemaNegative, -3, /not in range/);
        expectIsInvalid(schemaNegative, 0, /not in range/);
        expectIsInvalid(schemaNegative, 123.2, /not in range/);

        expectIsValid(schemaNegative, -5);
        expectIsValid(schemaNegative, -5.213);
        expectIsValid(schemaNegative, -61);
        expectIsValid(schemaNegative, -123123);
    });
});

describe('[isSchemaNumberFieldInteger]', () => {
    it('Works as it should', () => {
        expect(() => isSchemaNumberFieldInteger(sString().type())).toThrow(
            /valid number field/
        );

        expect(() => isSchemaNumberFieldInteger({})).toThrow(
            /valid number field/
        );

        expect(isSchemaNumberFieldInteger(sNumber().type())).toBe(false);
        expect(isSchemaNumberFieldInteger(sNumberInRange(1, 2).type())).toBe(
            false
        );
        expect(isSchemaNumberFieldInteger(sNumber().noDecimals().type())).toBe(
            true
        );
        expect(isSchemaNumberFieldInteger(sInteger().type())).toBe(true);
        expect(isSchemaNumberFieldInteger(sIntegerInRange(1, 2).type())).toBe(
            true
        );
    });
});
