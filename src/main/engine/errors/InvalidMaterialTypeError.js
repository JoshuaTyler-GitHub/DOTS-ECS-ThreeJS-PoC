// engine - errors
import LoggedError from '@engine/errors/LoggedError';

class InvalidMaterialTypeError extends LoggedError {
  constructor(clazz, message) {
    super(clazz, message);
    this.id = String(InvalidMaterialTypeError.prototype.constructor.name);
    this.log();
  }
}
export default InvalidMaterialTypeError;
