// logger
import LoggerFactory from '@logger/Logger';

class LoggedError extends Error {
  static logger = LoggerFactory.create(LoggedError);

  log() {
    const { clazz, id, message } = this;
    LoggedError.logger.error(
      `[${id}]`,
      `[${clazz.prototype.constructor.name}]`,
      message,
    );
  }
}
export default LoggedError;
