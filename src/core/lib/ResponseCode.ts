export default {
  BAD_REQUEST: {
    message: 'Bad Request',
    status: 400,
    code: 'BAD_REQUEST_ERROR',
  },
  EMPTY_EMAIL: {
    message: 'Empty email is not allowed. Please fill the email',
    status: 400,
    code: 'EMPTY_EMAIL_ERROR',
  },
  TOKEN_VERIFY: {
    message: 'Token verify error',
    status: 401,
    code: 'TOKEN_VERIFY_ERROR',
  },
  TOKEN_EXPIRED: {
    message: 'Token expired',
    status: 401,
    code: 'TOKEN_EXPIRED_ERROR',
  },
  BAD_REFRESH_TOKEN: {
    message: 'Bad Refresh token',
    status: 401,
    code: 'BAD_REFRESH_TOKEN_ERROR',
  },
  WRONG_EMAIL_CONFIRM_TOKEN: {
    message: 'Confirm email token is not registered. Probably it already used',
    status: 401,
    code: 'WRONG_EMAIL_CONFIRM_TOKEN_ERROR',
  },
  PARSE_TOKEN: {
    message: 'Trying get data from access token. Something wrong',
    status: 401,
    code: 'PARSE_TOKEN_ERROR',
  },
  INVALID_CREDENTIALS: {
    message: 'Invalid credentials',
    status: 403,
    code: 'INVALID_CREDENTIALS_ERROR',
  },
  ROUTE_NOT_FOUND: {
    message: 'Route not found',
    status: 404,
    code: 'ROUTE_NOT_FOUND_ERROR',
  },
  NOT_FOUND: {
    message: 'Empty response, not found',
    status: 404,
    code: 'NOT_FOUND_ERROR',
  },
  DB_DUPLICATE_CONFLICT: {
    message: 'Duplicate conflict. Resource already exists',
    status: 409,
    code: 'DB_DUPLICATE_CONFLICT_ERROR',
  },
  TOKEN_NOT_SIGNED: {
    message: 'Token not signed',
    status: 500,
    code: 'TOKEN_NOT_SIGNED_ERROR',
  },
  SERVER: {
    message: 'Server error occurred',
    status: 500,
    code: 'SERVER_ERROR',
  },
  DB: { message: 'DB error', status: 500, code: 'DB_ERROR' },
};
