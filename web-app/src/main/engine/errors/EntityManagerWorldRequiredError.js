// engine - errors
import LoggedError from '@engine/errors/LoggedError';

// constants
const DEFAULT_MESSAGE = String(
  'constructor() - Cannot create an EntityManager without a "world" reference.',
);

class EntityManagerWorldRequiredError extends LoggedError {
  constructor(className, message = DEFAULT_MESSAGE) {
    super(className, message);
    this.id = String(
      EntityManagerWorldRequiredError.prototype.constructor.name,
    );
    this.log();
  }
}
export default EntityManagerWorldRequiredError;
