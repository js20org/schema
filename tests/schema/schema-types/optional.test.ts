import { OptionalType } from '~/schema/schema-types';

describe('[OptionalType]', () => {
    it('Data is attached', () => {
        const data = {
            foo: 123,
        };

        const optionalObject = new OptionalType('Optional', data);
        expect((optionalObject.type() as any).nextSchema).toBe(data);
    });
});
