import util from 'util';
import { Stream } from 'stream';
import { AssertionError } from './AssertionError';
import { Rule } from '../Rule';

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
const validTypes = [Number, String, Object, Array, Boolean, Function];

function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

export class Assert {
  static fail(actual, expected, message?) {
    throw new AssertionError(
      message ||
        `Failed value: ${util.inspect(actual)}; ${
          expected !== undefined
            ? `Expect: ${util.inspect(expected.name || expected)}`
            : ''
        }`
    );
  }

  /**
   * Validate
   *
   * @param value
   * @param rule
   * @param required
   */
  static validate(value, rule, { required = false } = {}) {
    Assert.instanceOf(rule, Rule);
    const validationResult = rule.validator(value);
    if (!['boolean', 'string'].includes(typeof validationResult)) {
      Assert.fail(
        validationResult,
        null,
        'Validation result error. Validator should return string or boolean. Please check validation function'
      );
    }

    if (required) {
      if (typeof validationResult === 'string') {
        Assert.fail(value, validationResult);
      }
      if (validationResult === false) Assert.fail(value, rule.description);
    }

    if (value !== undefined && !required) {
      if (typeof validationResult === 'string') {
        Assert.fail(value, validationResult);
      }
      if (validationResult === false) {
        Assert.fail(value, rule.description);
      }
    }
  }

  /**
   * Ok
   *
   * @param value
   * @param message
   * @param required
   */
  static isOk(value, { message = '', required = false } = {}) {
    if (!value && required) Assert.fail(value, 'Truthful value', message);
    if (value !== undefined && !value) {
      Assert.fail(value, 'Truthful value', message);
    }
  }

  /**
   * Defined
   *
   * @param value
   * @param message
   */
  static defined(value, { message = '' } = {}) {
    if (value === undefined) {
      Assert.fail(value, 'No undefined values', message);
    }
  }

  /**
   * Instance of
   *
   * @param value
   * @param type
   * @param message
   */
  static instanceOf(value, type, message = '') {
    if (!(value instanceof type)) {
      Assert.fail(
        value,
        type,
        message ||
          `Failed instance: ${util.inspect(
            value
          )}; Expect instance of ${util.inspect(type.name || type)} class`
      );
    }
  }

  /**
   * Type of
   *
   * @param value
   * @param type
   * @param message
   */
  static typeOf(value, type, message) {
    if (!validTypes.includes(type)) {
      Assert.fail(
        value,
        type,
        message ||
          `Assert.typeOf accept one of [${validTypes.map(
            t => t.name
          )}] types. Use another method to validate "${type}"`
      );
    }

    if (type === Number && typeof value === 'number' && !isNaN(value)) {
      return;
    }
    if (type === String && typeof value === 'string') {
      return;
    }
    if (type === Object && isObject(value)) {
      return;
    }
    if (type === Array && Array.isArray(value)) {
      return;
    }
    if (type === Boolean && typeof value === 'boolean') {
      return;
    }
    if (type === Function && typeof value === 'function') {
      return;
    }

    Assert.fail(value, type, message);
  }

  /**
   * Array
   *
   * @param value
   * @param required
   * @param notEmpty
   * @param message
   * @param of
   */
  static array(
    value,
    { required = false, notEmpty = false, message = '', of = [] } = {}
  ) {
    if (!Array.isArray(of)) {
      Assert.fail(of, 'of option expect an Array type');
    }
    if (!of.every(i => validTypes.includes(i))) {
      Assert.fail(
        value,
        of,
        message ||
          `Assert.array 'of' option accept only one of [${validTypes.map(
            t => t.name
          )}] types`
      );
    }
    if (required || notEmpty) {
      Assert.typeOf(value, Array, message);
    }
    if (value !== undefined) {
      Assert.typeOf(value, Array, message);
    }
    if (value && !value.length && notEmpty) {
      Assert.fail(value, 'Not empty array');
    }
    if (
      value &&
      value.length &&
      of.length &&
      !value.every(i => of.includes(i.constructor))
    ) {
      Assert.fail(value, `Array of some [${of.map(t => t.name)}] types`);
    }
  }

  /**
   * Object
   *
   * @param value
   * @param required
   * @param notEmpty
   * @param message
   */
  static object(
    value,
    { required = false, notEmpty = false, message = '' } = {}
  ) {
    if (required || notEmpty) {
      Assert.typeOf(value, Object, message);
    }
    if (value !== undefined) {
      Assert.typeOf(value, Object, message);
    }
    if (notEmpty && !Object.keys(value).length) {
      Assert.fail(value, 'Not empty object', message);
    }
  }

  /**
   * Number
   *
   * @param value
   * @param required
   * @param message
   */
  static number(value, { required = false, message = '' } = {}) {
    if (required) {
      Assert.typeOf(value, Number, message);
    }
    if (value !== undefined) {
      Assert.typeOf(value, Number, message);
    }
  }

  /**
   * Integer
   *
   * @param value
   * @param required
   * @param positive
   * @param message
   */
  static integer(
    value,
    { required = false, positive = false, message = '' } = {}
  ) {
    if (required && !Number.isInteger(value)) {
      Assert.fail(value, 'Integer', message);
    }
    if (value !== undefined && !Number.isInteger(value)) {
      Assert.fail(value, 'Integer', message);
    }
    if (
      value !== undefined &&
      Number.isInteger(value) &&
      positive &&
      value < 0
    ) {
      Assert.fail(value, 'Positive integer', message);
    }
  }

  /**
   * String
   *
   * @param value
   * @param required
   * @param notEmpty
   * @param message
   */
  static string(
    value,
    { required = false, notEmpty = false, message = '' } = {}
  ) {
    if (required || notEmpty) Assert.typeOf(value, String, message);
    if (value !== undefined) Assert.typeOf(value, String, message);
    if (value !== undefined && !value.trim().length && notEmpty) {
      Assert.fail(value, 'Not empty string', message);
    }
  }

  /**
   * Boolean
   *
   * @param value
   * @param required
   * @param message
   */
  static boolean(value, { required = false, message = '' } = {}) {
    if (required) {
      Assert.typeOf(value, Boolean, message);
    }
    if (value !== undefined) {
      Assert.typeOf(value, Boolean, message);
    }
  }

  /**
   * Buffer
   *
   * @param value
   * @param required
   * @param notEmpty
   * @param message
   */
  static buffer(
    value,
    { required = false, notEmpty = false, message = '' } = {}
  ) {
    if (required && !Buffer.isBuffer(value)) {
      Assert.fail(value, 'Buffer', message);
    }
    if (value !== undefined && !Buffer.isBuffer(value)) {
      Assert.fail(value, 'Buffer', message);
    }
    if (!value.length && notEmpty) {
      Assert.fail(value, 'Not empty buffer', message);
    }
  }

  /**
   * Date
   *
   * @param value
   * @param required
   * @param message
   */
  static date(value, { required = false, message = '' } = {}) {
    if (required) {
      Assert.instanceOf(value, Date, message);
    }
    if (value !== undefined) {
      Assert.instanceOf(value, Date, message);
    }
  }

  /**
   * Func
   *
   * @param value
   * @param required
   * @param message
   */
  static func(value, { required = false, message = '' } = {}) {
    if (required) {
      Assert.typeOf(value, Function, message);
    }
    if (value !== undefined) {
      Assert.instanceOf(value, Function, message);
    }
  }

  /**
   * Stream
   *
   * @param value
   * @param required
   * @param message
   */
  static stream(value, { required = false, message = '' } = {}) {
    if (required) {
      Assert.instanceOf(value, Stream, message);
    }
    if (value !== undefined) {
      Assert.instanceOf(value, Stream, message);
    }
  }

  /**
   * ID
   *
   * @param value
   * @param required
   * @param message
   */
  static id(value, { required = false, message = '' } = {}) {
    const isValidId = typeof value === 'number' || UUID_REGEXP.test(value);
    if (!isValidId && required) {
      Assert.fail(value, 'UUID or Number', message);
    }
    if (value !== undefined && !isValidId) {
      Assert.fail(value, 'UUID or Number', message);
    }
  }

  /**
   * UUID
   *
   * @param value
   * @param required
   * @param message
   */
  static uuid(value, { required = false, message = '' } = {}) {
    Assert.string(value, { required, message });
    if (value && !UUID_REGEXP.test(value)) {
      Assert.fail(value, 'UUID', message);
    }
  }

  /**
   * URL
   *
   * @param value
   * @param required
   * @param message
   */
  static url(value, { required = false, message = '' } = {}) {
    Assert.string(value, { required, message });
    if (value && !URL_REGEXP.test(value)) {
      Assert.fail(value, 'URL', message);
    }
  }
}

if (process.env.NODE_NOASSERT) {
  Object.getOwnPropertyNames(Assert).forEach(
    key => (Assert[key] = function noAssert() {})
  );
}
