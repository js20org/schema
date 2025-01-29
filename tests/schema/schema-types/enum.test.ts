import { EnumType, isValidEnumBySchema } from '~/schema/schema-types';

enum Foobar {
    test1 = '1',
    test2 = '2'
}

describe('[EnumType]', () => {
    it('Works', () => {
        const enumType = new EnumType('Enum', Foobar);
        expect(enumType).toBeTruthy();
        expect((enumType.type() as any).enumType).toBe(Foobar);
    });

    it('Optional works', () => {
        const enumType = new EnumType('Enum', Foobar);
        expect((<any>enumType.type()).isOptional).toBe(false);

        enumType.optional();
        expect((<any>enumType.type()).isOptional).toBe(true);
    });
});


const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidEnumBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidEnumBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidEnumBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new EnumType('Enum', Foobar).type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, 1, /Value is not a string/);
        expectIsInvalid(schema, {}, /Value is not a string/);
        expectIsInvalid(schema, () => {}, /Value is not a string/);
        expectIsInvalid(schema, new EnumType('Enum', {}), /Value is not a string/);
        expectIsInvalid(schema, '', /valid enum value/);
        expectIsInvalid(schema, 'abc', /valid enum value/);
        expectIsInvalid(schema, false, /Value is not a string/);

        expectIsValid(schema, Foobar.test1);
        expectIsValid(schema, '2');
    });

    it('Optional works as it should', () => {
        const schema = new EnumType('Enum', Foobar).optional().type();

        expectIsInvalid(schema, 1, /Value is not a string/);
        expectIsInvalid(schema, {}, /Value is not a string/);
        expectIsInvalid(schema, () => {}, /Value is not a string/);
        expectIsInvalid(schema, new EnumType('Enum', {}), /Value is not a string/);
        expectIsInvalid(schema, '', /valid enum value/);
        expectIsInvalid(schema, 'abc', /valid enum value/);
        expectIsInvalid(schema, false, /Value is not a string/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
        expectIsValid(schema, Foobar.test1);
        expectIsValid(schema, '2');
    });
});
