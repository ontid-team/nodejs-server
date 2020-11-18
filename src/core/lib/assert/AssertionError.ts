export class AssertionError extends Error {
  code: 'ASSERTION_ERROR';
  status: 500;

  constructor(message) {
    super();
    this.message = message || 'Assertion error';
    this.code = 'ASSERTION_ERROR';
    this.status = 500;
  }
}
