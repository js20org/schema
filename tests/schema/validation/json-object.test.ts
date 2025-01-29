import {
    getJsonContentBySchema,
    getValidatedSchema,
    sBoolean,
    sClass,
    sDate,
    sEmptyObject,
    sFunction,
    sInteger,
    sNumber,
    sOptional,
    sString,
    ValidatedSchema,
} from '~/index';

import { getErrorMessage } from '../../../test-helpers';

class SomeClass {}

const expectThrows = (schema: any, value: any, expectedError: RegExp) => {
    const validated = getValidatedSchema(schema);

    try {
        getJsonContentBySchema(validated, value);
        fail('Supposed to throw.');
    } catch (e) {
        expect(getErrorMessage(e)).toMatch(expectedError);
    }
};

const expectOk = (schema: any, value: any, expectedOutput: any) => {
    const validated = getValidatedSchema(schema);
    const result = getJsonContentBySchema(validated, value);

    expect(result).toStrictEqual(expectedOutput);
};

describe('[getJsonContentBySchema]', () => {
    it('Empty object schemas works', () => {
        expectOk(sEmptyObject().type(), {}, {});
        expectOk(
            sEmptyObject().type(),
            {
                foo: {
                    bar: 123,
                },
            },
            {}
        );
        expectOk(sEmptyObject().type(), 1, {});
    });

    it('Only accepts object schemas', () => {
        expectThrows(sBoolean().type(), {}, /schema to be an object/);
        expectThrows(sString().type(), {}, /schema to be an object/);
        expectThrows(sNumber().type(), {}, /schema to be an object/);
        expectThrows(sFunction().type(), {}, /schema to be an object/);
        expectThrows(sClass(SomeClass).type(), {}, /schema to be an object/);
        expectThrows([sBoolean().type()], {}, /schema to be an object/);

        expectOk(
            {
                foo: sString().type(),
            },
            {
                foo: 'a',
            },
            {
                foo: 'a',
            }
        );
    });

    it('Only accepts values that are objects', () => {
        const schema = {
            foo: sString().type(),
        };

        expectThrows(schema, false, /value to be an object/);
        expectThrows(schema, 1, /value to be an object/);
        expectThrows(schema, () => {}, /value to be an object/);
        expectThrows(schema, [], /value to be an object/);
        expectThrows(schema, 'a', /value to be an object/);

        expectOk(schema, {}, {});
    });

    it('Rejects non-object value when object is expected', () => {
        const schema = {
            foo: {
                bar: sString().type(),
            },
        };

        expectThrows(
            schema,
            {
                foo: [],
            },
            /value to be an object/
        );
    });

    it('Rejects non-array value when array is expected', () => {
        const schema = {
            foo: [sString().type()],
        };

        expectThrows(
            schema,
            {
                foo: {
                    bar: 1,
                },
            },
            /value to be an array/
        );
    });

    it('Constructor is not allowed', () => {
        const schema = {
            foo: sString().type(),
        };

        expectThrows(
            schema,
            {
                constructor: () => {},
                foo: '1',
            },
            /value to be an object/
        );
    });

    it('Works as it should for complex structures', () => {
        const schema1 = {
            foo: sString().type(),
        };

        expectOk(schema1, {}, {});
        expectOk(
            schema1,
            {
                foo: false,
            },
            {
                foo: false,
            }
        );
        expectOk(
            schema1,
            {
                foo: 'a',
            },
            {
                foo: 'a',
            }
        );
        expectOk(
            schema1,
            {
                __proto__: {
                    foo: 'asd',
                },
                foo: 123,
                bar: 'fasd',
                __Other: [
                    {
                        something: 1,
                    },
                ],
            },
            {
                foo: 123,
            }
        );

        const schema2 = {
            foo: [
                {
                    bar: sBoolean().type(),
                    baz: {
                        lorem: sNumber().type(),
                    },
                },
            ],
            test: {
                test2: [sInteger().type()],
            },
        };

        expectThrows(schema2, {}, /an array/);
        expectThrows(
            schema2,
            {
                foo: [],
            },
            /an object/
        );
        expectThrows(
            schema2,
            {
                foo: [],
                test: {},
            },
            /an array/
        );
        expectOk(
            schema2,
            {
                foo: [],
                test: {
                    test2: [],
                },
            },
            {
                foo: [],
                test: {
                    test2: [],
                },
            }
        );
        expectThrows(
            schema2,
            {
                foo: [1, false],
                test: {
                    test2: [],
                },
            },
            /an object/
        );
        expectThrows(
            schema2,
            {
                foo: [{}],
                test: {
                    test2: [],
                },
            },
            /an object/
        );
        expectThrows(
            schema2,
            {
                foo: [{ baz: {} }, {}],
                test: {
                    test2: [],
                },
            },
            /an object/
        );
        expectOk(
            schema2,
            {
                foo: [
                    {
                        baz: {},
                    },
                ],
                test: {
                    test2: [],
                },
            },
            {
                foo: [
                    {
                        baz: {},
                    },
                ],
                test: {
                    test2: [],
                },
            }
        );
        expectOk(
            schema2,
            {
                foo: [],
                test: {
                    test2: [
                        1,
                        false,
                        'a',
                        {
                            __proto__: 'a',
                            foo: 1,
                        },
                        [],
                    ],
                },
            },
            {
                foo: [],
                test: {
                    test2: [1, false, 'a'],
                },
            }
        );
        expectThrows(
            schema2,
            {
                __proto__: () => {},
                foo: [],
                test: {
                    test2: [],
                },
            },
            /value to be an object/
        );
        expectOk(
            schema2,
            {
                a: 1,
                foo: [
                    { baz: {} },
                    { baz: {}, e: false },
                    { baz: {}, lorem: [{ __proto__: 'ey' }] },
                    {
                        baz: {},
                    },
                    {
                        bar: 2,
                        baz: {
                            __e: {
                                foo: 1,
                            },
                            lorem: 'e',
                        },
                        other: 'a',
                        stuff: () => {},
                    },
                    {
                        baz: {
                            a: () => {},
                            lorem: 123,
                        },
                    },
                    {
                        evil: 'e',
                        baz: {},
                    },
                ],
                test: {
                    __proto__: {
                        toString: () => 'EVIL!',
                    },
                    test2: [
                        2,
                        {
                            __proto__: 'e',
                        },
                        [],
                        false,
                        'e',
                        {},
                    ],
                },
                moreStuff: () => {},
            },
            {
                foo: [
                    {
                        baz: {},
                    },
                    {
                        baz: {},
                    },
                    {
                        baz: {},
                    },
                    {
                        baz: {},
                    },
                    {
                        bar: 2,
                        baz: {
                            lorem: 'e',
                        },
                    },
                    {
                        baz: {
                            lorem: 123,
                        },
                    },
                    {
                        baz: {},
                    },
                ],
                test: {
                    test2: [2, false, 'e'],
                },
            }
        );
    });

    it('Works as it should for optional objects', () => {
        const schema = {
            lorem: sOptional({
                foo: sString().type(),
                bar: sOptional({
                    baz: sBoolean().type(),
                }).type(),
            }).type(),
        };

        expectOk(schema, {}, {});
        expectOk(schema, { lorem: null }, { lorem: null });

        expectOk(
            schema,
            {
                foo: 123,
            },
            {}
        );

        expectThrows(
            schema,
            {
                lorem: [],
            },
            /to be an object/
        );

        expectOk(
            schema,
            {
                lorem: {
                    foo: 'abc',
                },
            },
            {
                lorem: {
                    foo: 'abc',
                },
            }
        );

        expectOk(
            schema,
            {
                lorem: {
                    foo: 'abc',
                    bar: null,
                },
            },
            {
                lorem: {
                    foo: 'abc',
                    bar: null,
                },
            }
        );

        expectOk(
            schema,
            {
                lorem: {
                    foo: 'abc',
                    bar: {},
                },
            },
            {
                lorem: {
                    foo: 'abc',
                    bar: {},
                },
            }
        );

        expectThrows(
            schema,
            {
                lorem: {
                    foo: 'abc',
                    bar: [],
                },
            },
            /to be an object/
        );

        expectOk(
            schema,
            {
                lorem: {
                    foo: 'abc',
                    bar: {
                        abc: 123,
                        baz: false,
                    },
                },
            },
            {
                lorem: {
                    foo: 'abc',
                    bar: {
                        baz: false,
                    },
                },
            }
        );
    });

    it('Works as it should for optional arrays', () => {
        const schema = {
            foo: sOptional({
                bar: sOptional([sString().type()]).type(),
            }).type(),
            baz: sOptional([
                {
                    inner: sString().type(),
                },
            ]).type(),
        };

        expectOk(schema, {}, {});
        expectOk(
            schema,
            {
                foo: {},
                baz: [],
            },
            {
                foo: {},
                baz: [],
            }
        );
        expectOk(
            schema,
            {
                foo: {
                    bar: [],
                },
                baz: [],
                other: 123,
            },
            {
                foo: {
                    bar: [],
                },
                baz: [],
            }
        );
        expectOk(
            schema,
            {
                foo: {
                    bar: ['a', 'b', 'c'],
                },
                other: 123,
                baz: [
                    {
                        inner: 'a',
                        foo: 123,
                    },
                ],
            },
            {
                foo: {
                    bar: ['a', 'b', 'c'],
                },
                baz: [
                    {
                        inner: 'a',
                    },
                ],
            }
        );

        expectThrows(
            schema,
            {
                foo: {
                    bar: ['a', 'b', 'c'],
                },
                baz: false,
            },
            /to be an array/
        );
        expectThrows(
            schema,
            {
                foo: {
                    bar: { a: 1 },
                },
                baz: [],
            },
            /to be an array/
        );

        const schema2 = {
            foo: sOptional(sString().type()).type(),
        };

        expect(() =>
            getJsonContentBySchema(new ValidatedSchema(schema2), { foo: 'abc' })
        ).toThrow(/array or object/);
    });

    it('Works for dates', () => {
        const schema = {
            date: sDate().type(),
        };

        const date = new Date();

        expectOk(
            schema,
            {
                date,
            },
            {
                date,
            }
        );
    });

    it('Works as it should for null/undefined', () => {
        const schema = {
            foo: sString().optional().type(),
            bar: sNumber().optional().type(),
        };

        expectOk(schema, {}, {});

        expectOk(
            schema,
            {
                foo: [1],
                bar: {},
            },
            {}
        );

        expectOk(
            schema,
            {
                foo: null,
                bar: {},
            },
            {
                foo: null,
            }
        );

        expectOk(
            schema,
            {
                foo: 'test',
            },
            {
                foo: 'test',
            }
        );

        expectOk(
            schema,
            {
                foo: 'test',
                bar: null,
            },
            {
                foo: 'test',
                bar: null,
            }
        );
    });
});
