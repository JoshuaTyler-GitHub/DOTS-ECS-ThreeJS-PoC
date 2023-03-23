class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.id = String('InvalidArgumentError');
  }
}
export default InvalidArgumentError;
