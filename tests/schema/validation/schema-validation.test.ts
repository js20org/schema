import { sString, getValidatedSchema, sOptional, sortObject } from '~/index';
import { getSchemaBase } from '~/schema/helpers';

import { getErrorMessage } from '../../../test-helpers';

const expectSchemaThrows = (schema: any, expectedError: RegExp) => {
    try {
        getValidatedSchema(schema);
        fail('Supposed to throw.');
    } catch (e) {
        expect(getErrorMessage(e)).toMatch(expectedError);
    }
};

const expectSchemaOk = (schema: any) => {
    expect(() => getValidatedSchema(schema)).not.toThrow();
};

describe('[validateSchema]', () => {
    it('Fields that have not been typed are rejected', () => {
        expectSchemaThrows(sString(), /did you forget to call type/);
    });

    it('Schema without type is rejected', () => {
        const schema = getSchemaBase(null, '');
        expectSchemaThrows(schema, /No "type" field present/);
    });

    it('Schema without known type is rejected', () => {
        const schema = getSchemaBase(<any>'foobar', '');
        expectSchemaThrows(schema, /Unknown field type "foobar"/);
    });

    it('Single field ok', () => {
        expectSchemaOk(sString().type());
    });

    it('Empty object is rejected', () => {
        expectSchemaThrows({}, /Expected non-empty object/);
        expectSchemaThrows({ foo: {} }, /Expected non-empty object/);
    });

    it('Nested invalid field is rejected', () => {
        const field = getSchemaBase(<any>'foobar', '');

        expectSchemaThrows(
            { foo: field },
            /Unknown field type "foobar"\.\nField: foo\n/
        );

        expectSchemaThrows(
            { foo: { bar: field } },
            /Unknown field type "foobar"\.\nField: foo\.bar/
        );

        expectSchemaThrows(
            {
                foo: sString().type(),
                bar: {
                    baz: sString().type(),
                    test: {
                        test2: field,
                    },
                },
            },
            /Unknown field type "foobar"\.\nField: bar\.test\.test2/
        );
    });

    it('Nested fields ok', () => {
        expectSchemaOk({
            foo: sString().type(),
            bar: {
                baz: sString().type(),
                test: {
                    test2: sString().type(),
                },
            },
        });
    });

    it('Invalid arrays are rejected', () => {
        expectSchemaThrows([], /Expected array to be a single element/);
        expectSchemaThrows(
            [sString().type(), sString().type()],
            /Expected array to be a single element/
        );

        expectSchemaThrows(
            { foobar: [] },
            /Expected array to be a single element/
        );
        expectSchemaThrows(
            { foobar: [sString().type(), sString().type()] },
            /Expected array to be a single element/
        );
    });

    it('Invalid array field rejected', () => {
        const field = getSchemaBase(<any>'foobar', '');

        expectSchemaThrows(
            [field],
            /Unknown field type "foobar"\.\nField: \[0\]/
        );
        expectSchemaThrows(
            { foobar: [field] },
            /Unknown field type "foobar"\.\nField: foobar\.\[0\]/
        );
    });

    it('Ok array is accepted', () => {
        expectSchemaOk([sString().type()]);
        expectSchemaOk([
            {
                foobar: sString().type(),
            },
        ]);

        expectSchemaOk({
            foobar: [sString().type()],
        });
    });

    it('Optional objects are validated', () => {
        expectSchemaThrows(sOptional(null).type(), /array or object/);
        expectSchemaThrows(sOptional(undefined).type(), /array or object/);
        expectSchemaThrows(
            sOptional([]).type(),
            /array to be a single element/
        );
        expectSchemaThrows(sOptional({}).type(), /non-empty object/);
        expectSchemaThrows(
            sOptional({ foo: 123 }).type(),
            /forget to call type/
        );
        expectSchemaThrows(
            sOptional({
                foo: sOptional({}).type(),
            }).type(),
            /non-empty object/
        );
        expectSchemaThrows(
            sOptional({
                foo: sOptional(false).type(),
            }).type(),
            /array or object/
        );
        expectSchemaThrows(
            sOptional([
                {
                    foo: sOptional(false).type(),
                },
            ]).type(),
            /array or object/
        );

        expectSchemaOk(sOptional({ foo: sString().type() }).type());
        expectSchemaOk(
            sOptional({
                foo: sOptional({
                    bar: sString().type(),
                }).type(),
            }).type()
        );
        expectSchemaOk(
            sOptional([
                {
                    foo: sString().type(),
                },
            ]).type()
        );
        expectSchemaOk(
            sOptional([
                {
                    foo: [sString().type()],
                },
            ]).type()
        );
    });
});
