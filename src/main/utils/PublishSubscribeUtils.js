// errors
import InvalidArgumentError from '@errors/InvalidArgumentError';

// utils
import UidUtils from '@utils/UidUtils';
import ValidationUtils from '@utils/ValidationUtils';

// cached functions
const hasProperty = Object.prototype.hasOwnProperty;

class PublishSubscribeUtils {
  static topics = {};

  /**
   * @static
   * @param {Object} params
   * @returns {String}
   * @throws {InvalidArgumentError}
   */
  static createTopic({ name = String('not-set'), metadata = {} }) {
    if (!ValidationUtils.string(name)) {
      throw new InvalidArgumentError(
        `[PublishSubscribeUtils] createTopic() - Cannot create topic, name: [${name}] does not pass validation (string).`,
      );
    }
    const topicId = UidUtils.uuid(Object.keys(PublishSubscribeUtils.topics));
    const topic = {
      id: String(topicId),
      subscribers: {},
      metadata,
      name,
    };
    PublishSubscribeUtils.topics[topicId] = topic;
    return String(topicId);
  }

  /**
   * @async
   * @static
   * @param {String} topicId
   * @param {Object} payload
   * @returns {Promise<Boolean>} isPayloadPublished
   * @throws {InvalidArgumentError}
   */
  static async publish(topicId, payload) {
    // verify topicId
    if (!ValidationUtils.string(topicId)) {
      throw new InvalidArgumentError(
        `[PublishSubscribeUtils] publish() - Cannot publish, topicId: [${topicId}] does not pass validation.`,
      );
    }
    if (!hasProperty.call(PublishSubscribeUtils.topics, topicId)) {
      throw new InvalidArgumentError(
        `[PublishSubscribeUtils] publish() - Cannot publish, no topic exists with topicId: [${topicId}].`,
      );
    }

    // verify payload
    if (!ValidationUtils.exists(payload)) {
      throw new InvalidArgumentError(
        `[PublishSubscribeUtils] publish() - Cannot publish, payload cannot be null or undefined.`,
      );
    }

    // iterate topic subscribers
    const topic = PublishSubscribeUtils.topics[topicId];
    const subscribers = topic.subscribers;
    let isPayloadPublished = Boolean(false);
    await Promise.all(
      Object.entries(subscribers).map(async ([subscriberId, subscriber]) => {
        // publish payload to subscriber
        if (hasProperty.call(subscriber, 'onPayload')) {
          subscriber.onPayload(payload);
          isPayloadPublished = Boolean(true);
        }

        // unsubscribe subscribers that are no longer listening for a payload
        else {
          PublishSubscribeUtils.unsubscribe(topicId, subscriberId);
        }
      }),
    );

    // return whether or not this payload was published to a subscriber
    return isPayloadPublished;
  }

  /**
   * @static
   * @param {String} topicId
   * @param {Function} onPayload
   * @param {Function} onUnsubscribe
   * @returns {String} subscriberId
   * @throws {InvalidArgumentError}
   */
  static subscribe(topicId, onPayload, onUnsubscribe) {
    // topic
    if (!ValidationUtils.string(topicId)) {
      throw new InvalidArgumentError(
        `[InvalidArgumentError] subscribe() - Cannot subscribe to topic, topicId: [${topicId}] does not pass validation (string).`,
      );
    }
    if (!hasProperty.call(PublishSubscribeUtils.topics, topicId)) {
      throw new InvalidArgumentError(
        `[InvalidArgumentError] subscribe() - Cannot subscribe to topic, no topic exists with topicId: [${topicId}].`,
      );
    }
    const topic = PublishSubscribeUtils.topics[topicId];

    // onPayload
    if (
      !ValidationUtils.exists(onPayload) ||
      !(onPayload instanceof Function)
    ) {
      throw new InvalidArgumentError(
        '[InvalidArgumentError] subscribe() - Cannot subscribe to topic, invalid subscriber "onPayload" callback.',
      );
    }

    // onUnsubscribe
    if (
      ValidationUtils.exists(onUnsubscribe) &&
      !(onUnsubscribe instanceof Function)
    ) {
      throw new InvalidArgumentError(
        '[InvalidArgumentError] subscribe() - Cannot subscribe to topic, invalid subscription "onUnsubscribe" callback.',
      );
    }

    // subscriber
    const subscriberId = UidUtils.uuid(Object.keys(topic.subscribers));
    topic.subscribers[subscriberId] = {
      id: subscriberId,
      onPayload,
      onUnsubscribe,
    };
    return subscriberId;
  }

  /**
   * @static
   * @param {String} topicId
   * @param {String} subscriberId
   * @returns {Promise<void>} void
   * @throws {InvalidArgumentError}
   */
  static unsubscribe(topicId, subscriberId) {
    // topic
    if (!ValidationUtils.string(topicId)) {
      throw new InvalidArgumentError(
        `[InvalidArgumentError] unsubscribe() - Cannot unsubscribe from topic, topicId: [${topicId}] does not pass validation (string).`,
      );
    }
    if (!hasProperty.call(PublishSubscribeUtils.topics, topicId)) {
      throw new InvalidArgumentError(
        `[InvalidArgumentError] unsubscribe() - Cannot unsubscribe from topic, no topic exists with topicId: [${topicId}].`,
      );
    }
    const topic = PublishSubscribeUtils.topics[topicId];

    // subscriber
    if (!ValidationUtils.string(subscriberId)) {
      throw new InvalidArgumentError(
        `[InvalidArgumentError] unsubscribe() - Cannot unsubscribe from topic, subscriberId: [${subscriberId}] does not pass validation (subscriberId).`,
      );
    }
    if (!hasProperty.call(topic.subscribers, subscriberId)) {
      throw new InvalidArgumentError(
        `[InvalidArgumentError] unsubscribe() - Cannot unsubscribe from topic, no subscriber exists with subscriberId: [${subscriberId}].`,
      );
    }
    const subscriber = topic.subscribers[subscriberId];

    // unsubscribe callback
    if (
      ValidationUtils.exists(subscriber.onUnsubscribe) &&
      subscriber.onUnsubscribe instanceof Function
    ) {
      subscriber.onUnsubscribe();
    }
    delete topic[subscriberId];
  }
}
export default PublishSubscribeUtils;
