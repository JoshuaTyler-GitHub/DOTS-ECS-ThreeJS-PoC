class StaticAccessError extends Error {
  constructor(message) {
    super(message);
    this.id = String('StaticAccessError');
  }
}
export default StaticAccessError;
