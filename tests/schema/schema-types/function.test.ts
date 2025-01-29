import { FunctionType, isValidFunctionBySchema } from '~/schema/schema-types';

describe('[FunctionType]', () => {
    it('Works', () => {
        const functionType = new FunctionType('Function');
        expect(functionType).toBeTruthy();
    });

    it('Optional works', () => {
        const functionType = new FunctionType('Function');
        expect((<any>functionType.type()).isOptional).toBe(false);

        functionType.optional();
        expect((<any>functionType.type()).isOptional).toBe(true);
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidFunctionBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidFunctionBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidFunctionBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new FunctionType('Function').type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, 1, /is not a function/);
        expectIsInvalid(schema, {}, /is not a function/);
        expectIsInvalid(schema, new FunctionType('Function'), /not a function/);
        expectIsInvalid(schema, '', /not a function/);
        expectIsInvalid(schema, 'abc', /not a function/);
        expectIsInvalid(schema, false, /not a function/);

        expectIsValid(schema, () => {});
        expectIsValid(schema, (foo: boolean, baz: string) => ({ foo, baz }));
    });

    it('Optional works as it should', () => {
        const schema = new FunctionType('Function').optional().type();

        expectIsInvalid(schema, {}, /is not a function/);
        expectIsInvalid(schema, 123, /not a function/);
        expectIsInvalid(schema, new FunctionType('Function'), /not a function/);
        expectIsInvalid(schema, '', /not a function/);
        expectIsInvalid(schema, 'abc', /not a function/);
        expectIsInvalid(schema, false, /not a function/);
        expectIsInvalid(schema, Number.NaN, /not a function/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
        expectIsValid(schema, () => {});
        expectIsValid(schema, (foo: boolean, baz: string) => ({ foo, baz }));
    });
});
