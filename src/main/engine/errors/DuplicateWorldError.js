// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class DuplicateWorldError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(DuplicateWorldError.prototype.constructor.name);
    this.log();
  }
}
export default DuplicateWorldError;
