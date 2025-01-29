import {
    getXCharacters,
    sString,
    sStringShort,
    sStringMedium,
    sStringLong,
    sBoolean,
    sNumber,
    sNumberInRange,
    sInteger,
    sIntegerInRange,
    sClass,
    sEnum,
    sFunction,
    validateSchemaAndValue,
    sStringInteger,
    sNull,
    sEmptyObject,
    sOptional,
    sDate,
} from '~/index';

import { getErrorMessage } from '../../test-helpers';

const expectSchemaThrows = (schema: any, value: any, expectedError: RegExp) => {
    try {
        validateSchemaAndValue(schema.type(), value);
        fail('Supposed to throw.');
    } catch (e) {
        expect(getErrorMessage(e)).toMatch(expectedError);
    }
};

const expectSchemaOk = (schema: any, value: any) => {
    expect(() => validateSchemaAndValue(schema.type(), value)).not.toThrow();
};

describe('[definitions]', () => {
    it('Works as they should', () => {
        expectSchemaOk(sNull(), null);
        expectSchemaOk(sNull(), undefined);

        expectSchemaThrows(sNull(), 1, /not null or undefined/);
        expectSchemaThrows(sNull(), false, /not null or undefined/);
        expectSchemaThrows(sNull(), {}, /not null or undefined/);
        expectSchemaThrows(sNull(), [], /not null or undefined/);

        expectSchemaOk(sEmptyObject(), {});

        expectSchemaThrows(sEmptyObject(), 1, /not an empty object/);
        expectSchemaThrows(sEmptyObject(), false, /not an empty object/);
        expectSchemaThrows(sEmptyObject(), { a: 1 }, /not an empty object/);
        expectSchemaThrows(sEmptyObject(), [], /not an empty object/);

        const sObject = {
            foo: sNumber().type(),
            bar: sString().type(),
        };

        expectSchemaOk(sOptional(sObject), undefined);
        expectSchemaOk(sOptional(sObject), null);
        expectSchemaOk(sOptional(sObject), {
            foo: 123,
            bar: 'asd',
        });
        expectSchemaOk(sOptional(sObject), {
            foo: 123,
            bar: 'asd',
        });
        expectSchemaOk(sOptional([sObject]), [
            {
                foo: 123,
                bar: 'asd',
            },
            {
                foo: 123,
                bar: 'asd',
            },
        ]);

        expectSchemaThrows(
            sOptional(sObject),
            {
                foo: 123,
                bar: false,
            },
            /not a string/
        );
        expectSchemaThrows(
            sOptional(sObject),
            {
                foo: 123,
            },
            /null or undefined/
        );
        expectSchemaThrows(
            sOptional([sObject]),
            [
                {
                    foo: 123,
                },
                {
                    foo: 123,
                    bar: 'asd',
                },
            ],
            /null or undefined/
        );

        expectSchemaOk(sString(), getXCharacters('a', 10050));

        expectSchemaThrows(
            sStringLong(),
            getXCharacters('a', 10050),
            /max-length/
        );
        expectSchemaOk(sStringLong(), getXCharacters('a', 10000));

        expectSchemaThrows(
            sStringMedium(),
            getXCharacters('a', 1050),
            /max-length/
        );
        expectSchemaOk(sStringMedium(), getXCharacters('a', 1000));

        expectSchemaThrows(
            sStringShort(),
            getXCharacters('a', 105),
            /max-length/
        );
        expectSchemaOk(sStringShort(), getXCharacters('a', 100));

        expectSchemaOk(sStringInteger(), '1');
        expectSchemaOk(sStringInteger(), '-52');
        expectSchemaThrows(sStringInteger(), '0.5', /integer string/);
        expectSchemaThrows(sStringInteger(), false, /not a string/);

        expectSchemaOk(sBoolean(), false);
        expectSchemaThrows(sBoolean(), 'a', /not a boolean/);

        expectSchemaOk(sNumber(), 1);
        expectSchemaOk(sNumber(), -52.42);
        expectSchemaThrows(sNumber(), 'a', /not a number/);
        expectSchemaThrows(sNumber(), [], /not a number/);

        expectSchemaOk(sDate(), new Date());
        expectSchemaOk(sDate(), new Date(2022, 2, 4));
        expectSchemaThrows(sDate(), 'a', /not a valid date/);
        expectSchemaThrows(sDate(), [], /not a valid date/);

        expectSchemaOk(sNumberInRange(-5, 5), -5);
        expectSchemaOk(sNumberInRange(-5, 5), -1);
        expectSchemaOk(sNumberInRange(-5, 5), 0);
        expectSchemaOk(sNumberInRange(-5, 5), 4.22);
        expectSchemaOk(sNumberInRange(-5, 5), 5);
        expectSchemaOk(sNumberInRange(10, 15), 10);
        expectSchemaOk(sNumberInRange(10, 15), 12);
        expectSchemaOk(sNumberInRange(10, 15), 14.99999);
        expectSchemaOk(sNumberInRange(10, 15), 15);
        expectSchemaOk(sNumberInRange(-15, -10), -15);
        expectSchemaOk(sNumberInRange(-15, -10), -12.4);
        expectSchemaOk(sNumberInRange(-15, -10), -10);

        expectSchemaThrows(sNumberInRange(-5, 5), -5.1, /not in range/);
        expectSchemaThrows(sNumberInRange(-5, 5), 5.0001, /not in range/);
        expectSchemaThrows(sNumberInRange(-5, 5), 15.0001, /not in range/);
        expectSchemaThrows(sNumberInRange(10, 15), 9.99999, /not in range/);
        expectSchemaThrows(sNumberInRange(10, 15), 15.3, /not in range/);
        expectSchemaThrows(sNumberInRange(-15, -10), -16, /not in range/);
        expectSchemaThrows(sNumberInRange(-15, -10), -9.99, /not in range/);
        expectSchemaThrows(sNumberInRange(-15, -10), -101, /not in range/);

        expectSchemaOk(sInteger(), 1);
        expectSchemaOk(sInteger(), -52);
        expectSchemaThrows(sInteger(), 0.5, /without decimals/);
        expectSchemaThrows(sInteger(), -12.3, /without decimals/);
        expectSchemaThrows(sInteger(), [], /not a number/);

        expectSchemaOk(sIntegerInRange(2, 5), 2);
        expectSchemaOk(sIntegerInRange(2, 5), 4);
        expectSchemaOk(sIntegerInRange(2, 5), 5);
        expectSchemaThrows(sIntegerInRange(2, 5), -3.1, /without decimals/);
        expectSchemaThrows(sIntegerInRange(2, 5), 4.0001, /without decimals/);
        expectSchemaThrows(sIntegerInRange(2, 5), 1.999, /without decimals/);
        expectSchemaThrows(sIntegerInRange(2, 5), 1, /not in range/);
        expectSchemaThrows(sIntegerInRange(2, 5), 6, /not in range/);

        class Foo {}
        class Bar {}
        expectSchemaOk(sClass(Foo), new Foo());
        expectSchemaThrows(sClass(Foo), new Bar(), /is not of type "Foo"/);

        enum FoobarEnum {
            test1 = '1',
            test2 = '2',
        }
        expectSchemaOk(sEnum(FoobarEnum), '1');
        expectSchemaThrows(sEnum(FoobarEnum), false, /is not a string/);

        expectSchemaOk(sFunction(), (a: string) => a);
        expectSchemaOk(sFunction().optional(), null);
        expectSchemaOk(sFunction().optional(), undefined);

        expectSchemaThrows(sFunction(), 152, /is not a function/);
        expectSchemaThrows(sFunction(), null, /null or undefined/);
        expectSchemaThrows(sFunction(), undefined, /null or undefined/);
    });
});
