// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class InvalidArgumentError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(InvalidArgumentError.prototype.constructor.name);
    this.log();
  }
}
export default InvalidArgumentError;
