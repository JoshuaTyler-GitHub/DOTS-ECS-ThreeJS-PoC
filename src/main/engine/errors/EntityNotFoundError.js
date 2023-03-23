// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class EntityNotFoundError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(EntityNotFoundError.prototype.constructor.name);
    this.log();
  }
}
export default EntityNotFoundError;
