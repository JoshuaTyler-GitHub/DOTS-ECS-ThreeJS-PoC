// errors
import InvalidArgumentError from '@errors/InvalidArgumentError';

// utils
import PublishSubscribeUtils from '@utils/PublishSubscribeUtils';
import ValidationUtils from '@utils/ValidationUtils';

// constants
const PREFIX_BYPASS = String('[DEBUG]');
const PREFIX_DEBUG = String('[DEBUG]');
const PREFIX_ERROR = String('[ERROR]');
const PREFIX_INFO = String('[INFO]');
const PREFIX_WARN = String('[WARN]');

class Logger {
  static debugActive = Boolean(true);
  static errorActive = Boolean(true);
  static infoActive = Boolean(true);
  static warnActive = Boolean(true);

  static isPublishingEnabled = Boolean(true);
  static topicId = PublishSubscribeUtils.createTopic({ name: 'Logger' });

  /*====================
  logging
  ====================*/
  /**
   * @static
   * @param {String} className
   * @param {Array<any>} args
   * @returns {void} void
   */
  static bypass(className, ...args) {
    const formattedClassName = Logger.formatClassName(className);
    const logObjects = args instanceof Array ? [...args] : [args];
    console.log(PREFIX_BYPASS, formattedClassName, ...logObjects); // NOSONAR
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static debug(className, topicId, ...args) {
    if (Logger.debugActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.debug(PREFIX_DEBUG, formattedClassName, ...logObjects); // NOSONAR
      Logger.private_publish(
        PREFIX_DEBUG,
        formattedClassName,
        topicId,
        ...logObjects,
      );
    }
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static error(className, topicId, ...args) {
    if (Logger.errorActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.error(PREFIX_ERROR, formattedClassName, ...logObjects); // NOSONAR
      Logger.private_publish(
        PREFIX_ERROR,
        formattedClassName,
        topicId,
        ...logObjects,
      );
    }
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static info(className, topicId, ...args) {
    if (Logger.infoActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.info(PREFIX_INFO, formattedClassName, ...logObjects); // NOSONAR
      Logger.private_publish(
        PREFIX_INFO,
        formattedClassName,
        topicId,
        ...logObjects,
      );
    }
  }

  /**
   * @static
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {void} void
   */
  static warn(className, topicId, ...args) {
    if (Logger.warnActive) {
      const formattedClassName = Logger.formatClassName(className);
      const logObjects = args instanceof Array ? [...args] : [args];
      console.warn(PREFIX_WARN, formattedClassName, ...logObjects); // NOSONAR
      Logger.private_publish(
        PREFIX_WARN,
        formattedClassName,
        topicId,
        ...logObjects,
      );
    }
  }

  /*====================
  formatting
  ====================*/
  /**
   * @static
   * @param {String} className
   * @returns {String} formattedClassName
   */
  static formatClassName(className) {
    return `[${className}]`;
  }

  /**
   * @static
   * @param {String} prefix
   * @param {String} className
   * @param {Array<any>} args
   * @returns {String} message
   */
  static formatMessage(prefix, className, ...args) {
    const message = [prefix, className];
    args.forEach((arg) => message.push(JSON.stringify(arg)));
    return message.join(', ');
  }

  /*====================
  publish & subscribe
  ====================*/
  /**
   * Any errors thrown from publishing to subscribers are caught here and logged
   * because we are already inside a log statement we do not want to propogate
   * back to the original caller.
   *
   * @async
   * @static
   * @param {String} prefix
   * @param {String} className
   * @param {String} topicId
   * @param {Array<any>} args
   * @returns {Promise<Boolean>} isPayloadPublished
   */
  static async private_publish(prefix, className, topicId, ...args) {
    if (Logger.isPublishingEnabled) {
      try {
        const formattedMessage = Logger.formatMessage(prefix, className, args);
        return PublishSubscribeUtils.publish(
          topicId || Logger.topicId,
          formattedMessage,
        );
      } catch (error) {
        Logger.error(
          `[Logger] private_publish() - Failed to publish due to: [${error}]`,
        );
      }
    }
  }

  /**
   * @static
   * @param {Function} onLogCallback
   * @param {String} topicId
   * @returns {String} subscriberId
   */
  static subscribe(onLogCallback, topicId = null) {
    return PublishSubscribeUtils.subscribe(
      topicId || Logger.topicId,
      onLogCallback,
    );
  }

  /**
   * @static
   * @param {String} subscriberId
   * @param {String} topicId
   * @returns {void} void
   */
  static unsubscribe(subscriberId, topicId = null) {
    return PublishSubscribeUtils.unsubscribe(
      topicId || Logger.topicId,
      subscriberId,
    );
  }
}

class LoggerFactory {
  /**
   * @static
   * @param {Class} clazz
   * @returns {InstancedLogger} logger
   * @throws {InvalidArgumentError}
   */
  static create(clazz) {
    const isValidClass = ValidationUtils.string(
      clazz.prototype.constructor.name,
    );
    if (isValidClass) {
      return new InstancedLogger(clazz.prototype.constructor.name);
    } else {
      throw new InvalidArgumentError(
        `[LoggerFactory] create() - Failed to create InstancedLogger, invalid argument "clazz" does not pass validation (string).`,
      );
    }
  }
}

class InstancedLogger {
  constructor(className) {
    this.className = className;
    this.topicId = PublishSubscribeUtils.createTopic({
      name: `Logger-${className}`,
    });
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  bypass(...args) {
    Logger.bypass(this.className, this.topicId, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  debug(...args) {
    Logger.debug(this.className, this.topicId, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  error(...args) {
    Logger.error(this.className, this.topicId, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  info(...args) {
    Logger.info(this.className, this.topicId, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  warn(...args) {
    Logger.warn(this.className, this.topicId, ...args);
  }
}
export default LoggerFactory;
