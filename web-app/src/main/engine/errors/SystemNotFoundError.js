// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class SystemNotFoundError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(SystemNotFoundError.prototype.constructor.name);
    this.log();
  }
}
export default SystemNotFoundError;
