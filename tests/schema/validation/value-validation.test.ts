import {
    sAny,
    sEmptyObject,
    sNull,
    sOptional,
    ValidatedSchema,
} from '~/schema';

import { getSchemaBase } from '~/schema/helpers';
import { validateBySchema } from '~/schema/validation/value-validation';

import {
    sBoolean,
    sClass,
    sEnum,
    sFunction,
    sInteger,
    sNumber,
    sString,
} from '~/index';

import { getErrorMessage } from '../../test-helpers';

const expectSchemaThrows = (schema: any, value: any, expectedError: RegExp) => {
    try {
        validateBySchema(new ValidatedSchema(schema), value);
        fail('Supposed to throw.');
    } catch (e) {
        expect(getErrorMessage(e)).toMatch(expectedError);
    }
};

const expectSchemaOk = (schema: any, value: any) => {
    expect(() =>
        validateBySchema(new ValidatedSchema(schema), value)
    ).not.toThrow();
};

describe('[validateSchema]', () => {
    it('Fields without valid types are rejected', () => {
        expectSchemaThrows(getSchemaBase(null as any, ''), {}, /Unknown schema type/);
    });

    it('Simple valid fields are accepted', () => {
        expectSchemaOk(sString().type(), 'foobar');
        expectSchemaOk(sInteger().type(), 1);
        expectSchemaOk(sInteger().type(), -511);
        expectSchemaOk(sNumber().type(), 512);
        expectSchemaOk(sNumber().type(), 1.2);
        expectSchemaOk(sBoolean().type(), true);
        expectSchemaOk(sBoolean().type(), false);
        expectSchemaOk(sNull().type(), null);
        expectSchemaOk(sNull().type(), undefined);
        expectSchemaOk(sEmptyObject().type(), {});
    });

    it('Simple invalid fields are rejected', () => {
        expectSchemaThrows(sString().type(), 1, /does not match the schema/);
        expectSchemaThrows(sInteger().type(), 1.2, /does not match the schema/);
        expectSchemaThrows(
            sNumber().type(),
            false,
            /does not match the schema/
        );
        expectSchemaThrows(sBoolean().type(), 'a', /does not match the schema/);
        expectSchemaThrows(sNull().type(), 1, /does not match the schema/);
        expectSchemaThrows(
            sEmptyObject().type(),
            { a: 1 },
            /does not match the schema/
        );
    });

    it('Valid arrays are accepted', () => {
        expectSchemaOk([sString().type()], []);
        expectSchemaOk([sString().type()], ['a', 'b']);
        expectSchemaOk([sString().type()], ['a', 'b', 'c']);

        expectSchemaOk([sBoolean().type()], [false]);
        expectSchemaOk([sBoolean().type()], [true, false]);
        expectSchemaOk([sBoolean().type()], [false, false, false, true]);

        expectSchemaOk([sInteger().type()], [1]);
        expectSchemaOk([sInteger().type()], [23, 4]);
        expectSchemaOk([sInteger().type()], [51, 2, 3, 1]);

        expectSchemaOk([sNull().type()], [null, undefined]);
        expectSchemaOk([sNull().type()], []);
        expectSchemaOk([sEmptyObject().type()], [{}, {}, {}]);
    });

    it('Invalid arrays are rejected', () => {
        expectSchemaThrows(
            [sString().type()],
            1,
            /Expected value to be an array/
        );
        expectSchemaThrows(
            [sString().type()],
            {},
            /Expected value to be an array/
        );
        expectSchemaThrows(
            [sString().type()],
            () => {},
            /Expected value to be an array/
        );

        expectSchemaThrows(
            [sString().type()],
            [1],
            /does not match the schema/
        );
        expectSchemaThrows(
            [sString().type()],
            ['a', 2],
            /does not match the schema/
        );
        expectSchemaThrows(
            [sString().type()],
            ['a', 'b', 2, 'c'],
            /Value is not a string\nField: \[2\]/
        );
        expectSchemaThrows(
            [sInteger().type()],
            [2, 3, 4, 5.2],
            /without decimals\nField: \[3\]/
        );
        expectSchemaThrows(
            [sNull().type()],
            [null, 1],
            /not null or undefined/
        );
    });

    it('Constructor is not allowed', () => {
        expectSchemaThrows(
            { foo: sString().type() },
            {
                constructor: () => {},
                foo: 'a',
            },
            /value to be an object/
        );
    });

    it('Valid objects are accepted', () => {
        expectSchemaOk(
            {
                foo: sNumber().type(),
            },
            {
                foo: 12,
            }
        );

        expectSchemaOk(
            {
                foo: {
                    bar: sString().type(),
                    baz: sString().type(),
                },
            },
            {
                foo: {
                    bar: 'a',
                    baz: 'b',
                },
            }
        );

        expectSchemaOk(
            {
                foo: {
                    bar: sNumber().type(),
                    baz: sBoolean().type(),
                },
                lorem: {
                    ipsum: {
                        dolor: sString().type(),
                        set: sNumber().type(),
                    },
                    a: sString().type(),
                },
                test: sBoolean().type(),
            },
            {
                foo: {
                    bar: -125,
                    baz: false,
                },
                lorem: {
                    ipsum: {
                        dolor: '2e',
                        set: 2e2,
                    },
                    a: 'abc',
                },
                test: true,
            }
        );
    });

    it('Invalid objects are rejected', () => {
        expectSchemaThrows(
            {
                foo: sNumber().type(),
            },
            123,
            /value to be an object/
        );

        expectSchemaThrows(
            {
                foo: sNumber().type(),
            },
            [
                {
                    foo: 123,
                },
            ],
            /value to be an object/
        );

        expectSchemaThrows(
            {
                foo: sNumber().type(),
            },
            {
                foo: 12,
                bar: false,
            },
            /more keys than the schema/
        );

        expectSchemaThrows(
            {
                foo: {
                    bar: sString().type(),
                    baz: sString().type(),
                },
            },
            {
                foo: {
                    bar: 'a',
                    baz: false,
                },
            },
            /does not match the schema/
        );

        expectSchemaThrows(
            {
                foo: {
                    bar: sNumber().type(),
                    baz: sBoolean().type(),
                },
                lorem: {
                    ipsum: {
                        dolor: sString().type(),
                        set: sNumber().type(),
                    },
                    a: sString().type(),
                },
                test: sBoolean().type(),
            },
            {
                foo: {
                    bar: -125,
                    baz: false,
                },
                lorem: {
                    ipsum: {
                        //Difference
                        dolor: false,
                        set: 2e2,
                    },
                    a: 'abc',
                },
                test: true,
            },
            /does not match the schema/
        );

        expectSchemaThrows(
            {
                foo: {
                    bar: sNumber().type(),
                    baz: sBoolean().type(),
                },
                lorem: {
                    ipsum: {
                        dolor: sString().type(),
                        set: sNumber().type(),
                    },
                    a: sString().type(),
                },
                test: sBoolean().type(),
            },
            {
                foo: {
                    bar: -125,
                    baz: false,
                },
                lorem: {
                    ipsum: {
                        dolor: 'e23',
                        set: 2e2,
                    },
                    //One too many
                    g: 2,
                    a: 'abc',
                },
                test: true,
            },
            /more keys than the schema/
        );

        expectSchemaThrows(
            {
                foo: {
                    bar: sNumber().type(),
                    baz: sBoolean().type(),
                },
                lorem: {
                    ipsum: {
                        dolor: sString().type(),
                        set: sNumber().type(),
                    },
                    a: sString().type(),
                },
                test: sBoolean().type(),
            },
            {
                foo: {
                    bar: -125,
                    baz: false,
                },
                lorem: {
                    ipsum: {
                        dolor: 'e23',
                        set: 2e2,
                    },
                    //One too few
                },
                test: true,
            },
            /null or undefined/
        );
    });

    it('Many schemas are working correctly', () => {
        const schema1 = sString().nonEmpty().maxLength(5).type();
        expectSchemaOk(schema1, 'a');
        expectSchemaOk(schema1, 'abc');
        expectSchemaOk(schema1, 'abcde');

        expectSchemaThrows(schema1, '', /is empty/);
        expectSchemaThrows(schema1, 'abcdef', /max-length/);
        expectSchemaThrows(schema1, null, /null or undefined/);
        expectSchemaThrows(schema1, false, /not a string/);
        expectSchemaThrows(schema1, ['a'], /not a string/);
        expectSchemaThrows(schema1, { foo: 'a' }, /not a string/);

        const schema2 = [sInteger().type()];
        expectSchemaOk(schema2, [1]);
        expectSchemaOk(schema2, [0, 2, 7]);
        expectSchemaOk(schema2, [-5, 2]);

        expectSchemaThrows(schema2, [false], /not a number*/);
        expectSchemaThrows(schema2, [1, false], /not a number*/);
        expectSchemaThrows(schema2, [1, 2, false], /not a number*/);
        expectSchemaThrows(schema2, [1.2], /without decimals*/);
        expectSchemaThrows(schema2, [1, 2, 3, -1.2], /without decimals/);
        expectSchemaThrows(schema2, '', /value to be an array/);
        expectSchemaThrows(schema2, 'abcdef', /value to be an array/);
        expectSchemaThrows(schema2, null, /value to be an array/);
        expectSchemaThrows(schema2, false, /value to be an array/);
        expectSchemaThrows(schema2, ['a'], /not a number/);
        expectSchemaThrows(schema2, { foo: 'a' }, /value to be an array/);

        const schema3 = [
            {
                foo: sNumber().type(),
                bar: [sString().type()],
            },
        ];
        expectSchemaOk(schema3, []);
        expectSchemaOk(schema3, [
            {
                foo: 2,
                bar: ['a'],
            },
        ]);
        expectSchemaOk(schema3, [
            {
                foo: -2.23,
                bar: ['a', 'b'],
            },
            {
                foo: 25,
                bar: [],
            },
            {
                foo: -25,
                bar: ['', ''],
            },
        ]);

        expectSchemaThrows(
            schema3,
            [
                {
                    __evil: 5,
                    foo: -2.23,
                    bar: ['a', 'b'],
                },
            ],
            /more keys than the schema/
        );
        expectSchemaThrows(
            schema3,
            [
                {
                    foo: () => -2.23,
                    bar: ['a', 'b'],
                },
            ],
            /a number/
        );
        expectSchemaThrows(
            schema3,
            [
                {
                    foo: -2.23,
                    bar: ['a', 'b'],
                },
                {
                    foo: 25,
                    bar: [false],
                },
            ],
            /not a string/
        );
        expectSchemaThrows(
            schema3,
            [
                {
                    foo: 'a',
                    bar: ['a', 'b'],
                },
            ],
            /not a number/
        );
        expectSchemaThrows(
            schema3,
            [
                {
                    foo: 2,
                    bar: ['a', 'b'],
                    baz: 2,
                },
            ],
            /more keys than the schema/
        );
        expectSchemaThrows(
            schema3,
            [
                {
                    bar: ['a', 'b'],
                },
            ],
            /null or undefined/
        );
        expectSchemaThrows(schema3, [false], /to be an object/);
        expectSchemaThrows(
            schema3,
            {
                foo: 2,
                bar: ['a'],
            },
            /to be an array/
        );
        expectSchemaThrows(
            schema3,
            [
                {
                    foo: 2,
                    bar: [null],
                },
            ],
            /null or undefined/
        );

        const schema4 = {
            foo: {
                baz: sBoolean().type(),
                lorem: [
                    {
                        ipsum: sString().type(),
                        dolor: sBoolean().type(),
                    },
                ],
            },
            bar: [sInteger().type()],
            test: {
                foobar: sBoolean().type(),
            },
        };
        expectSchemaOk(schema4, {
            foo: {
                baz: false,
                lorem: [],
            },
            bar: [],
            test: {
                foobar: true,
            },
        });
        expectSchemaOk(schema4, {
            foo: {
                baz: false,
                lorem: [
                    {
                        ipsum: 'a',
                        dolor: true,
                    },
                    {
                        ipsum: 'b',
                        dolor: false,
                    },
                ],
            },
            bar: [1, 2, 3, 5],
            test: {
                foobar: true,
            },
        });

        expectSchemaThrows(schema4, null, /an object/);
        expectSchemaThrows(schema4, 2, /an object/);
        expectSchemaThrows(schema4, [{}], /an object/);
        expectSchemaThrows(schema4, {}, /to be an object/);
        expectSchemaThrows(
            schema4,
            {
                foo: null,
                bar: [],
                test: {
                    foobar: true,
                },
            },
            /be an object/
        );
        expectSchemaThrows(
            schema4,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: 'a',
                            dolor: 1,
                        },
                    ],
                },
                bar: [],
                test: {
                    foobar: true,
                },
            },
            /a boolean/
        );
        expectSchemaThrows(
            schema4,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: 'a',
                        },
                    ],
                },
                bar: [],
                test: {
                    foobar: true,
                },
            },
            /null or undefined/
        );
        expectSchemaThrows(
            schema4,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: 'a',
                            dolor: false,
                        },
                    ],
                },
                bar: [2, 5, 2, 3.5],
                test: {
                    foobar: true,
                },
            },
            /decimals/
        );
        expectSchemaThrows(
            schema4,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: 'a',
                            dolor: false,
                        },
                        {
                            ipsum: 'a',
                            dolor: false,
                        },
                        {
                            ipsum: 'a',
                            dolor: 2,
                        },
                    ],
                },
                bar: [2, 5, 2, 3, 5],
                test: {
                    foobar: true,
                },
            },
            /boolean/
        );

        const schema5 = {
            foo: {
                baz: sBoolean().type(),
                lorem: [
                    {
                        ipsum: sString().optional().type(),
                        dolor: [sInteger().type()],
                    },
                ],
            },
            bar: [sString().optional().type()],
            test: {
                foobar: sString().optional().type(),
            },
        };
        expectSchemaOk(schema5, {
            foo: {
                baz: false,
                lorem: [],
            },
            bar: [],
            test: {
                foobar: null,
            },
        });
        expectSchemaOk(schema5, {
            foo: {
                baz: false,
                lorem: [
                    {
                        ipsum: undefined,
                        dolor: [5, 3, 2],
                    },
                ],
            },
            bar: [],
            test: {
                foobar: null,
            },
        });
        expectSchemaOk(schema5, {
            foo: {
                baz: false,
                lorem: [
                    {
                        ipsum: undefined,
                        dolor: [5, 3, 2],
                    },
                ],
            },
            bar: ['a', undefined, null, 'e'],
            test: {
                foobar: null,
            },
        });
        expectSchemaOk(schema5, {
            foo: {
                baz: false,
                lorem: [
                    {
                        ipsum: undefined,
                        dolor: [5, 3, 2],
                    },

                    {
                        ipsum: '2',
                        dolor: [],
                    },
                ],
            },
            bar: ['a', 'e', ''],
            test: {
                foobar: '',
            },
        });

        expectSchemaThrows(
            schema5,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: undefined,
                            dolor: [5, 3, 2],
                        },

                        {
                            ipsum: '2',
                            dolor: [],
                        },
                    ],
                },
                bar: ['a', 'e', ''],
            },
            /to be an object/
        );
        expectSchemaThrows(
            schema5,
            [
                {
                    foo: {
                        baz: false,
                        lorem: [
                            {
                                ipsum: undefined,
                                dolor: [5, 3, 2],
                            },

                            {
                                ipsum: '2',
                                dolor: [],
                            },
                        ],
                    },
                    bar: ['a', 'e', ''],
                    test: {
                        foobar: '',
                    },
                },
            ],
            /an object/
        );
        expectSchemaThrows(
            schema5,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: undefined,
                            dolor: [5, 3, 2],
                        },
                        {
                            ipsum: '2',
                            dolor: [],
                        },
                        {
                            ipsum: '2',
                            dolor: [1, 2, 3, 45, 5.5],
                        },
                    ],
                },
                bar: ['a', 'e', ''],
                test: {
                    foobar: '',
                },
            },
            /decimals/
        );
        expectSchemaThrows(
            schema5,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: {
                                a: 2,
                            },
                            dolor: [5, 3, 2],
                        },
                    ],
                },
                bar: ['a', 'e', ''],
                test: {
                    foobar: '',
                },
            },
            /a string/
        );
        expectSchemaThrows(
            schema5,
            {
                foo: {
                    baz: false,
                    lorem: [
                        {
                            ipsum: undefined,
                            dolor: [5, 3, 2],
                        },
                    ],
                },
                bar: undefined,
                test: {
                    foobar: '',
                },
            },
            /an array/
        );
        expectSchemaThrows(
            schema5,
            {
                foo: {
                    baz: 1,
                    lorem: [
                        {
                            ipsum: undefined,
                            dolor: [5, 3, 2],
                        },
                    ],
                },
                bar: [],
                test: {
                    foobar: '',
                },
            },
            /a boolean/
        );
        expectSchemaThrows(schema5, null, /an object/);
        expectSchemaThrows(schema5, 1, /an object/);
        expectSchemaThrows(schema5, () => {}, /an object/);
        expectSchemaThrows(schema5, [], /an object/);

        class Foo {}
        class Bar {}
        class Baz extends Foo {}

        const schema6 = {
            foo: sClass(Foo).type(),
            bar: {
                value: sClass(Bar).type(),
                other: sString().nonEmpty().type(),
            },
        };
        expectSchemaOk(schema6, {
            foo: new Foo(),
            bar: {
                value: new Bar(),
                other: 'a',
            },
        });
        expectSchemaOk(schema6, {
            foo: new Baz(),
            bar: {
                value: new Bar(),
                other: 'a',
            },
        });

        expectSchemaThrows(
            schema6,
            {
                foo: new Bar(),
                bar: {
                    value: new Bar(),
                    other: 'a',
                },
            },
            /not of type "Foo"/
        );
        expectSchemaThrows(
            schema6,
            {
                foo: null,
                bar: {
                    value: new Bar(),
                    other: 'a',
                },
            },
            /null or undefined/
        );
        expectSchemaThrows(
            schema6,
            {
                foo: new Foo(),
                bar: {
                    value: new Baz(),
                    other: 'a',
                },
            },
            /not of type "Bar"/
        );
        expectSchemaThrows(
            schema6,
            {
                foo: new Foo(),
                bar: {
                    value: false,
                    other: 'a',
                },
            },
            /not of type "Bar"/
        );
        expectSchemaThrows(
            schema6,
            {
                bar: {
                    value: new Bar(),
                    other: 'a',
                },
            },
            /null or undefined/
        );

        enum FoobarEnum {
            test1 = '1',
            test2 = '2',
        }
        const schema7 = {
            foo: sFunction().type(),
            bar: sEnum<FoobarEnum>(FoobarEnum).type(),
        };
        expectSchemaOk(schema7, {
            foo: () => {},
            bar: FoobarEnum.test1,
        });
        expectSchemaOk(schema7, {
            foo: (a: string) => a,
            bar: '2',
        });

        expectSchemaThrows(
            schema7,
            {
                foo: 123,
                bar: FoobarEnum.test1,
            },
            /not a function/
        );
        expectSchemaThrows(
            schema7,
            {
                foo: () => {},
                bar: 'aaa',
            },
            /valid enum value/
        );
        expectSchemaThrows(
            schema7,
            {
                foo: undefined,
                bar: FoobarEnum.test1,
            },
            /null or undefined/
        );

        const schema8 = {
            foo: sFunction().optional().type(),
            bar: sNumber().type(),
        };

        expectSchemaOk(schema8, {
            foo: undefined,
            bar: 123,
        });
        expectSchemaOk(schema8, {
            foo: null,
            bar: 123,
        });
        expectSchemaOk(schema8, {
            foo: () => {},
            bar: 123,
        });

        expectSchemaThrows(
            schema8,
            {
                foo: 123,
                bar: 123,
            },
            /not a function/
        );
        expectSchemaThrows(
            schema8,
            {
                foo: () => {},
            },
            /null or undefined/
        );
    });

    it('Optional objects are working', () => {
        const schema1 = sOptional({
            foo: sNumber().type(),
        }).type();

        expectSchemaOk(schema1, null);
        expectSchemaOk(schema1, undefined);
        expectSchemaOk(schema1, {
            foo: 123,
        });

        expectSchemaThrows(schema1, 123, /to be an object/);
        expectSchemaThrows(
            schema1,
            {
                foo: false,
            },
            /not a number/
        );
        expectSchemaThrows(
            schema1,
            {
                foo: 123,
                bar: 'a',
            },
            /more keys than the schema/
        );

        const schema2 = {
            foo: sOptional({
                bar: sNumber().type(),
            }).type(),
            baz: sString().type(),
        };

        expectSchemaOk(schema2, {
            foo: undefined,
            baz: 'abc',
        });
        expectSchemaOk(schema2, {
            foo: null,
            baz: 'abc',
        });
        expectSchemaOk(schema2, {
            foo: {
                bar: 123,
            },
            baz: 'abc',
        });

        expectSchemaThrows(
            schema2,
            {
                foo: [],
                baz: 'abc',
            },
            /to be an object/
        );
        expectSchemaThrows(
            schema2,
            {
                foo: {},
                baz: 'abc',
            },
            /null or undefined/
        );
        expectSchemaThrows(
            schema2,
            {
                foo: {
                    bar: 123,
                },
            },
            /null or undefined/
        );
        expectSchemaThrows(
            schema2,
            {
                foo: {
                    bar: 123,
                },
                baz: false,
            },
            /not a string/
        );
        expectSchemaThrows(
            schema2,
            {
                foo: {
                    bar: false,
                },
                baz: false,
            },
            /not a number/
        );
        expectSchemaThrows(
            schema2,
            {
                foo: {
                    bar: 123,
                    other: false,
                },
                baz: false,
            },
            /more keys than the schema/
        );

        const schema3 = {
            foo: sOptional({
                bar: sNumber().type(),
                nested: sOptional({
                    other: sInteger().optional().type(),
                }).type(),
            }).type(),
        };

        expectSchemaOk(schema3, {
            foo: undefined,
        });
        expectSchemaOk(schema3, {
            foo: null,
        });
        expectSchemaOk(schema3, {
            foo: {
                bar: 123,
                nested: null,
            },
        });
        expectSchemaOk(schema3, {
            foo: {
                bar: 123,
                nested: undefined,
            },
        });
        expectSchemaOk(schema3, {
            foo: {
                bar: 123,
                nested: {
                    other: undefined,
                },
            },
        });
        expectSchemaOk(schema3, {
            foo: {
                bar: 123,
                nested: {
                    other: 12,
                },
            },
        });
        expectSchemaOk(schema3, {});
        expectSchemaOk(schema3, {
            foo: {
                bar: 123,
                nested: {},
            },
        });

        expectSchemaThrows(
            schema3,
            {
                foo: 123,
            },
            /an object/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: {
                    bar: 123,
                    nested: undefined,
                },
                baz: 123,
            },
            /more keys than the schema/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: {
                    bar: 123,
                    nested: undefined,
                    a: 123,
                },
            },
            /more keys than the schema/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: {
                    bar: 123,
                    nested: 'a',
                },
            },
            /an object/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: {
                    bar: 123,
                    nested: {
                        other: false,
                    },
                },
            },
            /not a number/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: {
                    bar: 123,
                    nested: {
                        other: 123,
                        foo: false,
                    },
                },
            },
            /more keys than the schema/
        );
    });

    it('Optional arrays are working', () => {
        const schema = sOptional([sString().type()]).type();

        expectSchemaOk(schema, undefined);
        expectSchemaOk(schema, null);
        expectSchemaOk(schema, []);
        expectSchemaOk(schema, ['a', 'b', 'c']);

        expectSchemaThrows(schema, {}, /to be an array/);
        expectSchemaThrows(schema, ['a', 1], /not a string/);

        const schema2 = sOptional([
            {
                foo: sOptional([sString().type()]).type(),
            },
        ]).type();

        expectSchemaOk(schema2, undefined);
        expectSchemaOk(schema2, null);
        expectSchemaOk(schema2, []);
        expectSchemaOk(schema2, [
            {
                foo: undefined,
            },
        ]);
        expectSchemaOk(schema2, [
            {
                foo: null,
            },
        ]);
        expectSchemaOk(schema2, [
            {
                foo: [],
            },
        ]);
        expectSchemaOk(schema2, [
            {
                foo: ['a', 'b'],
            },
            {
                foo: ['a'],
            },
        ]);

        expectSchemaThrows(schema2, 123, /to be an array/);
        expectSchemaThrows(schema2, [123], /to be an object/);
        expectSchemaThrows(
            schema2,
            [
                {
                    foo: 'a',
                },
            ],
            /to be an array/
        );
        expectSchemaThrows(
            schema2,
            [
                {
                    foo: [1],
                },
            ],
            /not a string/
        );
        expectSchemaThrows(
            schema2,
            [
                {
                    foo: ['a'],
                },
                {
                    foo: ['b', false],
                },
            ],
            /not a string/
        );

        const schema3 = {
            foo: sOptional([
                {
                    bar: sOptional([sString().type()]).type(),
                },
            ]).type(),
        };

        expectSchemaOk(schema3, {
            foo: null,
        });
        expectSchemaOk(schema3, {
            foo: undefined,
        });
        expectSchemaOk(schema3, {
            foo: [],
        });
        expectSchemaOk(schema3, {
            foo: [
                {
                    bar: null,
                },
            ],
        });
        expectSchemaOk(schema3, {
            foo: [
                {
                    bar: ['a', 'b'],
                },
            ],
        });
        expectSchemaOk(schema3, {});

        expectSchemaThrows(schema3, null, /to be an object/);
        expectSchemaThrows(schema3, { foo: [1] }, /to be an object/);
        expectSchemaThrows(
            schema3,
            {
                foo: [
                    {
                        bar: 123,
                    },
                ],
            },
            /to be an array/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: [
                    {
                        bar: null,
                    },
                    {
                        bar: [false],
                    },
                ],
            },
            /not a string/
        );
        expectSchemaThrows(
            schema3,
            {
                foo: [
                    {
                        bar: ['a', 'b'],
                    },
                    {
                        bar: 123,
                    },
                ],
            },
            /to be an array/
        );

        expect(() =>
            validateBySchema(new ValidatedSchema(sOptional(123).type()), {})
        ).toThrow(/array or object/);
    });

    it('Value key deletion works as it should', () => {
        const schema = {
            foo: sString().type(),
            bar: sNumber().type(),
        };

        const value = {
            foo: 'a',
            bar: 123,
        };

        expectSchemaOk(schema, value);

        //Original value is still intact
        expect(value).toStrictEqual({
            foo: 'a',
            bar: 123,
        });

        expectSchemaThrows(
            schema,
            {
                foo: 'a',
            },
            /null or undefined/
        );

        expectSchemaThrows(
            schema,
            {
                foo: 'a',
                bar: 123,
                baz: 'foo',
            },
            /more keys than the schema/
        );

        expectSchemaThrows(schema, { a: 1, b: 2 }, /null or undefined/);
    });

    it('Any works as it should', () => {
        const schema = sAny().type();
        const schema2 = {
            foo: sAny().type(),
            bar: sNumber().type(),
        };

        expectSchemaOk(schema, null);
        expectSchemaOk(schema, undefined);
        expectSchemaOk(schema, {});
        expectSchemaOk(schema, 1);
        expectSchemaOk(schema, false);
        expectSchemaOk(schema, {
            abc: '123',
        });

        expectSchemaOk(schema2, {
            bar: 123,
        });

        expectSchemaOk(schema2, {
            foo: null,
            bar: 1213,
        });

        expectSchemaOk(schema2, {
            foo: {
                bar: 123,
            },
            bar: 1213,
        });

        expectSchemaThrows(
            schema2,
            {
                foo: {
                    bar: 123,
                },
                bar: false,
            },
            /is not a number/
        );

        expectSchemaThrows(
            schema2,
            {
                foo: {
                    bar: 123,
                    baz: false,
                },
            },
            /is null or undefined/
        );
    });
});
