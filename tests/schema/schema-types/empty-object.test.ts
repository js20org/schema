import {
    EmptyObjectType,
    isValidByEmptyObjectSchema,
} from '~/schema/schema-types';

describe('[EmptyObjectType]', () => {
    it('Works', () => {
        const emptyObjectType = new EmptyObjectType('EmptyObject');
        expect(emptyObjectType).toBeTruthy();
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidByEmptyObjectSchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidByEmptyObjectSchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidByEmptyObjectSchema]', () => {
    it('No rules works as it should', () => {
        const schema = new EmptyObjectType('EmptyObject').type();

        expectIsInvalid(schema, 1, /not an empty object/);
        expectIsInvalid(schema, [], /not an empty object/);
        expectIsInvalid(schema, () => {}, /not an empty object/);
        expectIsInvalid(
            schema,
            new EmptyObjectType('EmptyObject'),
            /not an empty object/
        );
        expectIsInvalid(schema, '', /not an empty object/);
        expectIsInvalid(schema, 'abc', /not an empty object/);
        expectIsInvalid(schema, false, /not an empty object/);
        expectIsInvalid(schema, true, /not an empty object/);
        expectIsInvalid(schema, null, /not an empty object/);
        expectIsInvalid(schema, undefined, /not an empty object/);
        expectIsInvalid(
            schema,
            {
                foo: 1,
            },
            /not an empty object/
        );
        expectIsInvalid(
            schema,
            {
                foo: { bar: 4 },
                e: 1,
                g: false,
                ee: () => {},
            },
            /not an empty object/
        );

        expectIsValid(schema, {});
    });
});
