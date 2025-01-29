import { BooleanType, isValidBooleanBySchema } from '~/schema/schema-types';

describe('[BooleanType]', () => {
    it('Works', () => {
        const booleanType = new BooleanType('Boolean');
        expect(booleanType).toBeTruthy();
    });

    it('Optional works', () => {
        const booleanType = new BooleanType('Boolean');
        expect((<any>booleanType.type()).isOptional).toBe(false);

        booleanType.optional();
        expect((<any>booleanType.type()).isOptional).toBe(true);
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidBooleanBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidBooleanBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidBooleanBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new BooleanType('Boolean').type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, 1, /is not a boolean/);
        expectIsInvalid(schema, {}, /is not a boolean/);
        expectIsInvalid(schema, () => {}, /not a boolean/);
        expectIsInvalid(schema, new BooleanType('Boolean'), /not a boolean/);
        expectIsInvalid(schema, '', /not a boolean/);
        expectIsInvalid(schema, 'abc', /not a boolean/);

        expectIsValid(schema, false);
        expectIsValid(schema, true);
    });

    it('Optional works as it should', () => {
        const schema = new BooleanType('Boolean').optional().type();

        expectIsInvalid(schema, 1, /is not a boolean/);
        expectIsInvalid(schema, {}, /is not a boolean/);
        expectIsInvalid(schema, () => {}, /not a boolean/);
        expectIsInvalid(schema, new BooleanType('Boolean'), /not a boolean/);
        expectIsInvalid(schema, '', /not a boolean/);
        expectIsInvalid(schema, 'abc', /not a boolean/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
        expectIsValid(schema, false);
        expectIsValid(schema, true);
    });
});
