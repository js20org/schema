import {
    sString,
    ValidatedSchema,
    isSameSchemaBase,
    sStringUuid,
    sFunction,
    sClass,
    sBoolean,
    sNumber,
    sInteger,
    sEnum,
    sNumberInRange,
    sStringLong,
    sStringMedium,
    getSchemaFieldType,
    SchemaType,
    isSchemaFieldOptional,
    sIntegerInRange,
    sEmptyObject,
    isSchemaType,
    sDate,
} from '~/index';

describe('[ValidatedSchema]', () => {
    it('Works as it should', () => {
        const sBar = sString().type();
        const sFoo = {
            bar: sBar,
        };
        const schema = {
            foo: sFoo,
        };

        const validatedSchema = new ValidatedSchema(schema);
        expect(validatedSchema.getSchema()).toStrictEqual(schema);

        const fooSchema = validatedSchema.getSchemaSection((s) => s.foo);
        expect(fooSchema).toBeInstanceOf(ValidatedSchema);
        expect(fooSchema.getSchema()).toStrictEqual(sFoo);

        const barSchema = fooSchema.getSchemaSection((s) => s.bar);
        expect(barSchema).toBeInstanceOf(ValidatedSchema);
        expect(barSchema.getSchema()).toStrictEqual(sBar);
    });

    it('Freezes and clones', () => {
        const schema = {
            foo: sString().type(),
        };

        const validatedSchema = new ValidatedSchema(schema);
        const clonedSchema = validatedSchema.getSchema();

        expect(schema).toStrictEqual(clonedSchema);
        expect(schema).not.toBe(clonedSchema);

        schema.foo = 'test-value';

        expect(schema).toStrictEqual({
            foo: 'test-value',
        });

        expect(clonedSchema).toStrictEqual({
            foo: sString().type(),
        });

        expect(() => (clonedSchema['foo'] = 'asd')).toThrow(
            /assign to read only/
        );
    });
});

describe('[isSameSchemaBase]', () => {
    it('Validates first arg', () => {
        const valid = sString().type();

        expect(() => isSameSchemaBase(null, valid)).toThrow(/First argument/);
        expect(() => isSameSchemaBase({}, valid)).toThrow(/First argument/);
        expect(() => isSameSchemaBase({ label: 1 }, valid)).toThrow(
            /First argument/
        );
        expect(() => isSameSchemaBase({ label: '' }, valid)).toThrow(
            /First argument/
        );
        expect(() => isSameSchemaBase({ label: 'a' }, valid)).not.toThrow();
    });

    it('Validates first arg', () => {
        const valid = sString().type();

        expect(() => isSameSchemaBase(valid, {})).toThrow(/Second argument/);
        expect(() => isSameSchemaBase(valid, { label: 'a' })).not.toThrow();
    });

    it('Works as it should for same', () => {
        expect(isSameSchemaBase(sString().type(), sString().type())).toBe(true);

        expect(
            isSameSchemaBase(sStringUuid().type(), sStringUuid().type())
        ).toBe(true);

        expect(isSameSchemaBase(sFunction().type(), sFunction().type())).toBe(
            true
        );

        expect(isSameSchemaBase(sDate().type(), sDate().type())).toBe(
            true
        );

        expect(
            isSameSchemaBase(sClass<any>({}).type(), sClass<any>({}).type())
        ).toBe(true);

        expect(isSameSchemaBase(sBoolean().type(), sBoolean().type())).toBe(
            true
        );

        expect(isSameSchemaBase(sNumber().type(), sNumber().type())).toBe(true);
        expect(isSameSchemaBase(sInteger().type(), sInteger().type())).toBe(
            true
        );
        expect(isSameSchemaBase(sEnum({}).type(), sEnum({}).type())).toBe(true);

        expect(
            isSameSchemaBase(
                sNumberInRange(1, 2).type(),
                sNumberInRange(2, 5).type()
            )
        ).toBe(true);

        expect(
            isSameSchemaBase(sString().type(), sString().optional().type())
        ).toBe(true);
    });

    it('Works as it should for not same', () => {
        expect(isSameSchemaBase(sString().type(), sStringUuid().type())).toBe(
            false
        );

        expect(
            isSameSchemaBase(sStringLong().type(), sStringMedium().type())
        ).toBe(false);

        expect(isSameSchemaBase(sString().type(), sNumber().type())).toBe(
            false
        );
        expect(isSameSchemaBase(sInteger().type(), sNumber().type())).toBe(
            false
        );
        expect(isSameSchemaBase(sBoolean().type(), sNumber().type())).toBe(
            false
        );
        expect(isSameSchemaBase(sFunction().type(), sClass({}).type())).toBe(
            false
        );
        expect(isSameSchemaBase(sDate().type(), sClass({}).type())).toBe(
            false
        );
        expect(isSameSchemaBase(sEnum({}).type(), sClass({}).type())).toBe(
            false
        );
    });
});

describe('[getSchemaFieldType]', () => {
    it('Works as it should', () => {
        expect(getSchemaFieldType(sString().type())).toBe(SchemaType.STRING);
        expect(getSchemaFieldType(sBoolean().type())).toBe(SchemaType.BOOLEAN);
        expect(getSchemaFieldType(sNumber().type())).toBe(SchemaType.NUMBER);
        expect(getSchemaFieldType(sInteger().type())).toBe(SchemaType.NUMBER);

        expect(() => getSchemaFieldType({})).toThrow(/valid schema field/);
    });
});

describe('[isSchemaFieldOptional]', () => {
    it('Works as it should', () => {
        expect(isSchemaFieldOptional(sString().type())).toBe(false);
        expect(isSchemaFieldOptional(sNumber().type())).toBe(false);
        expect(isSchemaFieldOptional(sFunction().type())).toBe(false);
        expect(isSchemaFieldOptional(sEnum({}).type())).toBe(false);
        expect(isSchemaFieldOptional(sBoolean().type())).toBe(false);

        expect(isSchemaFieldOptional(sString().optional().type())).toBe(true);
        expect(isSchemaFieldOptional(sNumber().optional().type())).toBe(true);
        expect(
            isSchemaFieldOptional(sIntegerInRange(5, 1).optional().type())
        ).toBe(true);
        expect(isSchemaFieldOptional(sBoolean().optional().type())).toBe(true);
        expect(isSchemaFieldOptional(sEnum({}).optional().type())).toBe(true);

        expect(isSchemaFieldOptional({})).toBe(false);
    });
});

describe('[isSchemaType]', () => {
    it('Works as it should', () => {
        expect(isSchemaType(sString().type(), SchemaType.STRING)).toBe(true);
        expect(
            isSchemaType(sEmptyObject().type(), SchemaType.EMPTY_OBJECT)
        ).toBe(true);
        expect(isSchemaType(sNumber().type(), SchemaType.NUMBER)).toBe(true);

        expect(isSchemaType(sString().type(), SchemaType.NUMBER)).toBe(false);
        expect(
            isSchemaType({ foo: sString().type() }, SchemaType.EMPTY_OBJECT)
        ).toBe(false);
        expect(isSchemaType({}, SchemaType.EMPTY_OBJECT)).toBe(false);
    });
});
