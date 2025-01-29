import {
    ClassInstanceType,
    isValidClassInstanceBySchema,
} from '~/schema/schema-types';

class Foo {}
class Bar {}
class Baz extends Foo {}

describe('[ClassInstanceType]', () => {
    it('Works', () => {
        const classType = new ClassInstanceType('Class', Foo);
        expect(classType).toBeTruthy();
        expect((classType.type() as any).classType).toBe(Foo);
    });
});

const expectIsValid = (schema: any, value: any) => {
    const { isValid } = isValidClassInstanceBySchema(schema, value);
    expect(isValid).toBe(true);
};

const expectIsInvalid = (schema: any, value: any, expectedReason: RegExp) => {
    const { isValid, reason } = isValidClassInstanceBySchema(schema, value);

    expect(isValid).toBe(false);
    expect(reason).toMatch(expectedReason);
};

describe('[isValidBooleanBySchema]', () => {
    it('No rules works as it should', () => {
        const schema = new ClassInstanceType('Class', Foo).type();

        expectIsInvalid(schema, null, /null or undefined/);
        expectIsInvalid(schema, undefined, /null or undefined/);
        expectIsInvalid(schema, 1, /is not of type "Foo"/);
        expectIsInvalid(schema, {}, /is not of type "Foo"/);
        expectIsInvalid(schema, () => {}, /is not of type "Foo"/);
        expectIsInvalid(schema, ClassInstanceType, /is not of type "Foo"/);
        expectIsInvalid(schema, Bar, /is not of type "Foo"/);
        expectIsInvalid(schema, new Bar(), /is not of type "Foo"/);
        expectIsInvalid(schema, Foo, /is not of type "Foo"/);
        expectIsInvalid(schema, '', /is not of type "Foo"/);
        expectIsInvalid(schema, 'abc', /is not of type "Foo"/);
        expectIsInvalid(schema, false, /is not of type "Foo"/);
        expectIsInvalid(schema, true, /is not of type "Foo"/);
        
        expectIsValid(schema, new Foo());
        expectIsValid(schema, new Baz());
    });
});
