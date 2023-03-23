// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class DuplicateCanvasManagerError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(DuplicateCanvasManagerError.prototype.constructor.name);
    this.log();
  }
}
export default DuplicateCanvasManagerError;
