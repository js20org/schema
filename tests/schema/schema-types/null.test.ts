import { NullType, isValidNullBySchema } from '~/schema/schema-types';

describe('[NullType]', () => {
    it('Works', () => {
        const nullType = new NullType('Null');
        expect(nullType).toBeTruthy();
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidNullBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidNullBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidNullBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new NullType('Null').type();

        expectIsInvalid(schema, 1, /not null or undefined/);
        expectIsInvalid(schema, {}, /not null or undefined/);
        expectIsInvalid(schema, [], /not null or undefined/);
        expectIsInvalid(schema, () => {}, /not null or undefined/);
        expectIsInvalid(schema, new NullType('Null'), /not null or undefined/);
        expectIsInvalid(schema, '', /not null or undefined/);
        expectIsInvalid(schema, 'abc', /not null or undefined/);
        expectIsInvalid(schema, false, /not null or undefined/);
        expectIsInvalid(schema, true, /not null or undefined/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
    });
});
