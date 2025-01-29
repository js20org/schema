import { getValidatedSchema } from './schema-validation'
import { validateBySchema } from './value-validation';

export const validateSchemaAndValue = (schema: any, value: any) => {
    const validatedSchema = getValidatedSchema(schema);
    validateBySchema(validatedSchema, value);
};
