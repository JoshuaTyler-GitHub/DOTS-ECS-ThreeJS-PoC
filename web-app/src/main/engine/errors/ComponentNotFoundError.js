// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class ComponentNotFoundError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(ComponentNotFoundError.prototype.constructor.name);
    this.log();
  }
}
export default ComponentNotFoundError;
