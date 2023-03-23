// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class InvalidGeometryTypeError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(InvalidGeometryTypeError.prototype.constructor.name);
    this.log();
  }
}
export default InvalidGeometryTypeError;
