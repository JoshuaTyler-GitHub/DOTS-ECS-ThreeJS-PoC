// utils
import PublishSubscribeUtils from '@utils/PublishSubscribeUtils';
import ValidationUtils from '@utils/ValidationUtils';

class DomEventUtils {
  static eventListeners = {};
  static topicId = PublishSubscribeUtils.createTopic({
    name: String('DomEventUtils'),
  });

  /*====================
  eventListeners
  ====================*/
  /**
   * @static
   * @param {Event} event
   * @returns {void}
   */
  static _private_addEventListener(eventType) {
    if (!ValidationUtils.exists(DomEventUtils.eventListeners[eventType])) {
      DomEventUtils.eventListeners[eventType] = (event) =>
        DomEventUtils.publish(event);
      window.addEventListener(
        eventType,
        DomEventUtils.eventListeners[eventType],
        { passive: true },
      );
    }
  }

  /**
   * @static
   * @param {Event} event
   * @returns {void}
   */
  static _private_removeEventListener(eventType) {
    if (ValidationUtils.exists(DomEventUtils.eventListeners[eventType])) {
      window.removeEventListener(
        eventType,
        DomEventUtils.eventListeners[eventType],
      );
      delete DomEventUtils.eventListeners[eventType];
    }
  }

  /*====================
  publish & subcribe
  ====================*/
  /**
   * @async
   * @static
   * @param {Event} event
   * @returns {Promsie<Boolean>} isPayloadPublished
   */
  static async publish(event) {
    return PublishSubscribeUtils.publish(DomEventUtils.topicId, event);
  }

  /**
   * @static
   * @param {String} eventType
   * @param {Function} onEvent
   * @returns {String} subscriberId
   */
  static subscribe(eventType, onEvent) {
    DomEventUtils._private_addEventListener(eventType);
    return PublishSubscribeUtils.subscribe(DomEventUtils.topicId, (event) => {
      if (String(eventType) === event.type) {
        onEvent(event);
      }
    });
  }

  /**
   * @static
   * @param {String} subscriberId
   * @returns {void}
   */
  static unsubscribe(subscriberId) {
    PublishSubscribeUtils.unsubscribe(DomEventUtils.topicId, subscriberId);
  }
}
export default DomEventUtils;
