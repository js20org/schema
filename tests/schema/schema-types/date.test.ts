import { DateType, isValidDateBySchema } from '~/schema/schema-types';

describe('[DateType]', () => {
    it('Optional works', () => {
        const dateType = new DateType('Date');
        expect((<any>dateType.type()).isOptional).toBe(false);

        dateType.optional();
        expect((<any>dateType.type()).isOptional).toBe(true);
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidDateBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidDateBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidDateBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new DateType('Date').type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, {}, /not a valid date/);
        expectIsInvalid(schema, () => {}, /not a valid date/);
        expectIsInvalid(schema, new DateType('Date'), /not a valid date/);
        expectIsInvalid(schema, '', /not a valid date/);
        expectIsInvalid(schema, 'abc', /not a valid date/);
        expectIsInvalid(schema, false, /not a valid date/);
        expectIsInvalid(schema, Number.NaN, /not a valid date/);
        expectIsInvalid(schema, 1, /not a valid date/);

        expectIsValid(schema, new Date());
        expectIsValid(schema, new Date(2022, 2, 2));
    });

    it('Optional works as it should', () => {
        const schema = new DateType('Date').optional().type();

        expectIsInvalid(schema, {}, /not a valid date/);
        expectIsInvalid(schema, () => {}, /not a valid date/);
        expectIsInvalid(schema, new DateType('Date'), /not a valid date/);
        expectIsInvalid(schema, '', /not a valid date/);
        expectIsInvalid(schema, 'abc', /not a valid date/);
        expectIsInvalid(schema, false, /not a valid date/);
        expectIsInvalid(schema, Number.NaN, /not a valid date/);
        expectIsInvalid(schema, 1, /not a valid date/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
        expectIsValid(schema, new Date());
        expectIsValid(schema, new Date(2022, 2, 2));
    });
});
