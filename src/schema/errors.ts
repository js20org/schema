import { ISchemaIssue } from '../types';

export abstract class SchemaErrorBase extends Error {
    public issue: ISchemaIssue;

    constructor(message: string, issue: ISchemaIssue) {
        super(message);
        this.issue = issue;
    }
}

export class SchemaInvalidError extends SchemaErrorBase {
    constructor(issue: ISchemaIssue) {
        super('[Invalid schema] The schema is not valid.', issue);
    }
}

export class SchemaInvalidValueError extends SchemaErrorBase {
    private value: any;

    constructor(issue: ISchemaIssue, value: any) {
        super(
            '[Invalid value] The provided value does not match the schema.',
            issue
        );
        this.value = value;
    }

    getPotentiallyHarmfulValue() {
        return this.value;
    }
}
