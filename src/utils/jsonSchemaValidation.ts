import { JSONSchema7 } from 'json-schema';
import { ObjectId } from 'mongodb';
import Ajv from 'ajv';
import assert from 'http-assert';

export interface IJsonSchemas {
  params: JSONSchema7;
  query: JSONSchema7;
  body: JSONSchema7;
}

const ajv = new Ajv({ allErrors: true });
ajv.addFormat('objectId', ObjectId.isValid);

export function validate(schema: JSONSchema7, data: {}) {
  const validate = ajv.compile(schema);

  function getErrors() {
    const errors = validate.errors.reduce((accum, curr) => {
      if ('additionalProperty' in curr.params) {
        accum.push(`${curr.params.additionalProperty}: ${curr.message}.`);
      } else {
        accum.push(`${curr.dataPath.slice(1)}: ${curr.message}.`);
      }
      return accum;
    }, []);
    return errors;
  }
  const errors = validate(data) === true ? null : getErrors();

  assert(validate(data), 400, 'JSON schema validation error', {
    jsonSchemaErrors: errors,
  });
}
