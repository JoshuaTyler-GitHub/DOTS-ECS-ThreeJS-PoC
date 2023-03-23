// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class StaticAccessError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(StaticAccessError.prototype.constructor.name);
    this.log();
  }
}
export default StaticAccessError;
