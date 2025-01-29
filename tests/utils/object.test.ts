import { getFrozenClone } from '~/utils';

describe('[getFrozenClone]', () => {
    it('Works as it should for valid', () => {
        const object1 = {};
        const object2 = {
            foo: 123,
            bar: [{ a: 2 }],
        };
        const object3 = {
            foo: 123,
            bar: [{ a: { e: 5, f: [{ a: 5 }] } }],
            g: {
                r: [1, { e: 2 }],
            },
        };

        const result1: any = getFrozenClone(object1);
        const result2: any = getFrozenClone(object2);
        const result3: any = getFrozenClone(object3);

        expect(result1).toStrictEqual(object1);
        expect(result1).not.toBe(object1);
        expect(() => (result1['a'] = 5)).toThrow(/not extensible/);

        expect(result2).toStrictEqual(object2);
        expect(result2).not.toBe(object2);
        expect(() => (result2['a'] = 5)).toThrow(/not extensible/);
        expect(() => (result2.foo = 5)).toThrow(/assign to read only/);
        expect(() => result2.bar.push(<any>3)).toThrow(/not extensible/);
        expect(() => (result2.bar[0].a = 5)).toThrow(/assign to read only/);

        expect(result3).toStrictEqual(object3);
        expect(result3).not.toBe(object3);
        expect(() => (result3['a'] = 5)).toThrow(/not extensible/);
        expect(() => (result3.foo = 5)).toThrow(/assign to read only/);
        expect(() => result3.bar.push(<any>3)).toThrow(/not extensible/);
        expect(() => (result3.bar[0].a.e = 7)).toThrow(/assign to read only/);
        expect(() => result3.bar[0].a.f.push(<any>'a')).toThrow(
            /not extensible/
        );
        expect(() => (result3.bar[0].a.f[0].a = 55)).toThrow(
            /assign to read only/
        );
        expect(() => result3.g.r.push(<any>'a')).toThrow(/not extensible/);
        expect(() => (result3.g.r[0] = 5)).toThrow(/assign to read only/);
        expect(() => ((result3.g.r[1] as any).e = 7)).toThrow(
            /assign to read only/
        );

        class Foo {}

        const foo = new Foo();
        const method = () => {};

        expect(getFrozenClone(6)).toBe(6);
        expect(getFrozenClone(false)).toBe(false);
        expect(getFrozenClone('e')).toBe('e');
        expect(getFrozenClone(method)).toBe(method);
        expect(getFrozenClone(foo)).toBe(foo);

        const array1: any = [];
        const array2 = [6];
        const array3 = [{ foo: 2, a: [1] }];

        const resultArray1 = getFrozenClone(array1);
        const resultArray2 = getFrozenClone(array2);
        const resultArray3 = getFrozenClone(array3);

        expect(resultArray1).toStrictEqual(array1);
        expect(resultArray1).not.toBe(array1);
        expect(() => resultArray1.push('a')).toThrow(/not extensible/);

        expect(resultArray2).toStrictEqual(array2);
        expect(resultArray2).not.toBe(array2);
        expect(() => resultArray2.push(<any>'a')).toThrow(/not extensible/);
        expect(() => resultArray2[0] = 5).toThrow(/assign to read only/);

        expect(resultArray3).toStrictEqual(array3);
        expect(resultArray3).not.toBe(array3);
        expect(() => resultArray3.push(<any>'a')).toThrow(/not extensible/);
        expect(() => resultArray3[0] = <any>5).toThrow(/assign to read only/);
        expect(() => resultArray3[0].foo = 5).toThrow(/assign to read only/);
        expect(() => resultArray3[0].a = <any>5).toThrow(/assign to read only/);
        expect(() => resultArray3[0].a.push(5)).toThrow(/not extensible/);
    });
});
