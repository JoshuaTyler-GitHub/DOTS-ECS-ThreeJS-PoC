// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class WorldAlreadyCreatedError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(WorldAlreadyCreatedError.prototype.constructor.name);
    this.log();
  }
}
export default WorldAlreadyCreatedError;
