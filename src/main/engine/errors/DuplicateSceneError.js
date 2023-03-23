// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class DuplicateSceneError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(DuplicateSceneError.prototype.constructor.name);
    this.log();
  }
}
export default DuplicateSceneError;
