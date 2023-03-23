// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class DuplicateSystemError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(DuplicateSystemError.prototype.constructor.name);
    this.log();
  }
}
export default DuplicateSystemError;
