import { IJsonSchemas } from '../../utils/jsonSchemaValidation';

export const getUsersSchema: IJsonSchemas = {
  params: { type: 'object', maxProperties: 0 },
  body: { type: 'object', maxProperties: 0 },
  query: {
    $ref: '#/definitions/GetUsersQuery',
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      GetUsersQuery: {
        additionalProperties: false,
        properties: {
          skip: {
            type: 'string',
            minLength: 1,
          },
          limit: {
            type: 'string',
            minLength: 1,
          },
          search: {
            type: 'string',
            minLength: 1,
          },
        },
        required: [],
        type: 'object',
      },
    },
  },
};

export const deleteUsersSchema: IJsonSchemas = {
  params: { type: 'object', maxProperties: 0 },
  body: {
    $ref: '#/definitions/DeleteUsersBody',
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      DeleteUsersBody: {
        additionalProperties: false,
        properties: {
          ids: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
              type: 'string',
              format: 'objectId',
            },
          },
        },
        required: ['ids'],
        type: 'object',
      },
    },
  },
  query: { type: 'object', maxProperties: 0 },
};

export const banUsersSchema: IJsonSchemas = {
  params: { type: 'object', maxProperties: 0 },
  body: {
    $ref: '#/definitions/BanUsersBody',
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      BanUsersBody: {
        additionalProperties: false,
        properties: {
          users: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                _id: {
                  type: 'string',
                  format: 'objectId',
                },
                isActive: {
                  type: 'boolean',
                },
              },
              required: ['_id', 'isActive'],
            },
          },
        },
        required: ['users'],
        type: 'object',
      },
    },
  },
  query: { type: 'object', maxProperties: 0 },
};

export const getUserSchema: IJsonSchemas = {
  params: {
    $ref: '#/definitions/GetUserParams',
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      GetUserParams: {
        additionalProperties: false,
        properties: {
          userId: {
            type: 'string',
            format: 'objectId',
          },
        },
        required: ['userId'],
        type: 'object',
      },
    },
  },
  body: { type: 'object', maxProperties: 0 },
  query: { type: 'object', maxProperties: 0 },
};
