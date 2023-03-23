// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class InvalidSystemError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(InvalidSystemError.prototype.constructor.name);
    this.log();
  }
}
export default InvalidSystemError;
