// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class DuplicateComponentError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(DuplicateComponentError.prototype.constructor.name);
    this.log();
  }
}
export default DuplicateComponentError;
