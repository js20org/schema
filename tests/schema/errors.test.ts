import { SchemaInvalidError, SchemaInvalidValueError } from '~/index';
import { ISchemaIssue } from '~/types';
import { getErrorMessage } from '../../test-helpers';

const issue: ISchemaIssue = {
    schema: {
        foo: 'bar'
    },
    reason: 'test-reason',
    fieldKeys: ['a', 'b']
};

describe('[SchemaInvalidError]', () => {
    it('Works as it should', () => {
        try {
            throw new SchemaInvalidError(issue);
        } catch (e) {
            const error = <SchemaInvalidError>e;
            const errorMessage = getErrorMessage(error);

            expect(errorMessage).toContain('[Invalid schema]');
            expect(errorMessage).toContain('Field: a.b');
            expect(errorMessage).toContain('"foo": "bar"');

            expect(error.issue).toStrictEqual(issue);
        }
    });
});

describe('[SchemaInvalidValueError]', () => {
    it('Works as it should', () => {
        const value = 'test-value';

        try {
            throw new SchemaInvalidValueError(issue, value);
        } catch (e) {
            const error = <SchemaInvalidValueError>e;
            const errorMessage = getErrorMessage(error);

            expect(errorMessage).toContain('[Invalid value] The provided value does not match the schema');
            expect(errorMessage).toContain('Field: a.b');
            expect(errorMessage).toContain('"foo": "bar"');
            expect(errorMessage).not.toContain(value);

            expect(error.issue).toStrictEqual(issue);
            expect(error.getPotentiallyHarmfulValue()).toBe(value);
        }
    });
});