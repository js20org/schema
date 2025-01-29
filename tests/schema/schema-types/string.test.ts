import { StringType, isValidStringBySchema } from '~/schema/schema-types';
import { getSchemaStringFieldMaxLength, sString  } from '~/index';

describe('[StringType]', () => {
    it('Optional works', () => {
        const stringType = new StringType('String');
        expect((<any>stringType.type()).isOptional).toBe(false);

        stringType.optional();
        expect((<any>stringType.type()).isOptional).toBe(true);
    });

    it('Non-Empty works', () => {
        const stringType = new StringType('String');
        expect((<any>stringType.type()).isEmptyAllowed).toBe(true);

        stringType.nonEmpty();
        expect((<any>stringType.type()).isEmptyAllowed).toBe(false);
    });

    it('Regex works', () => {
        const regex = /foobar/;
        const stringType = new StringType('String');
        expect((<any>stringType.type()).matchesRegex).toBe(undefined);

        stringType.matches(regex);
        expect((<any>stringType.type()).matchesRegex).toBe(regex);
    });

    it('MaxLength works', () => {
        const stringType = new StringType('String');
        expect((<any>stringType.type()).maxLength).toBe(undefined);

        stringType.maxLength(1000);
        expect((<any>stringType.type()).maxLength).toBe(1000);
    });

    it('IntegerString works', () => {
        const stringType = new StringType('String');
        expect((<any>stringType.type()).isContentInteger).toBe(false);

        stringType.integerString();
        expect((<any>stringType.type()).isContentInteger).toBe(true);
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidStringBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidStringBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidStringBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new StringType('String').type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, false, /not a string/);
        expectIsInvalid(schema, 1, /not a string/);
        expectIsInvalid(schema, {}, /not a string/);
        expectIsInvalid(schema, () => {}, /not a string/);
        expectIsInvalid(schema, new StringType('String'), /not a string/);

        expectIsValid(schema, '');
        expectIsValid(schema, 'abc');
    });

    it('Optional works as it should', () => {
        const schema = new StringType('String').optional().type();

        expectIsInvalid(schema, false, /not a string/);
        expectIsInvalid(schema, 1, /not a string/);
        expectIsInvalid(schema, {}, /not a string/);
        expectIsInvalid(schema, () => {}, /not a string/);
        expectIsInvalid(schema, new StringType('String'), /not a string/);

        expectIsValid(schema, null);
        expectIsValid(schema, undefined);
        expectIsValid(schema, '');
        expectIsValid(schema, 'abc');
    });

    it('Non-Empty works as it should', () => {
        const schema = new StringType('String').nonEmpty().type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, false, /not a string/);
        expectIsInvalid(schema, 1, /not a string/);
        expectIsInvalid(schema, {}, /not a string/);
        expectIsInvalid(schema, () => {}, /not a string/);
        expectIsInvalid(schema, new StringType('String'), /not a string/);
        expectIsInvalid(schema, '', /is empty/);

        expectIsValid(schema, 'a');
        expectIsValid(schema, 'abc');
    });

    it('Max-Length works as it should', () => {
        const schema = new StringType('String').maxLength(5).type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, false, /not a string/);
        expectIsInvalid(schema, 1, /not a string/);
        expectIsInvalid(schema, {}, /not a string/);
        expectIsInvalid(schema, () => {}, /not a string/);
        expectIsInvalid(schema, new StringType('String'), /not a string/);
        expectIsInvalid(schema, 'abcdef', /max-length/);

        expectIsValid(schema, '');
        expectIsValid(schema, 'a');
        expectIsValid(schema, 'abc');
        expectIsValid(schema, 'abcde');
    });

    it('Regex works as it should', () => {
        const schema = new StringType('String').matches(/abc/).type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, false, /not a string/);
        expectIsInvalid(schema, 1, /not a string/);
        expectIsInvalid(schema, {}, /not a string/);
        expectIsInvalid(schema, () => {}, /not a string/);
        expectIsInvalid(schema, new StringType('String'), /not a string/);
        expectIsInvalid(schema, 'bbcdef', /regex/);
        expectIsInvalid(schema, '', /regex/);
        expectIsInvalid(schema, 'aaa', /regex/);
        expectIsInvalid(schema, 'aa', /regex/);

        expectIsValid(schema, 'abc');
        expectIsValid(schema, 'abcde');
        expectIsValid(schema, 'eeeabcde');
    });

    it('Integer-String works as it should', () => {
        const schema = new StringType('String').integerString().type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, false, /not a string/);
        expectIsInvalid(schema, 1, /not a string/);
        expectIsInvalid(schema, {}, /not a string/);
        expectIsInvalid(schema, () => {}, /not a string/);
        expectIsInvalid(schema, new StringType('String'), /not a string/);
        expectIsInvalid(schema, 'abcdef', /not an integer string/);
        expectIsInvalid(schema, '', /not an integer string/);
        expectIsInvalid(schema, 'abc', /not an integer string/);
        expectIsInvalid(schema, '1.5', /not an integer string/);
        expectIsInvalid(schema, '-1.5272', /not an integer string/);
        expectIsInvalid(schema, '0.5', /not an integer string/);

        expectIsValid(schema, '1');
        expectIsValid(schema, '11234');
        expectIsValid(schema, '0');
        expectIsValid(schema, '-51');
        expectIsValid(schema, '-1');
    });
});

describe('[StringType]', () => {
    it('Works as it should', () => {
        expect(getSchemaStringFieldMaxLength(sString().type())).toBe(null);
        expect(getSchemaStringFieldMaxLength(sString().maxLength(56).type())).toBe(56);
    });
});
