// utils
import PublishSubscribeUtils from '@utils/PublishSubscribeUtils';
import UidUtils from '@utils/UidUtils';

class ComponentSystem {
  constructor({
    cachedEntityQuery = [],
    cachedEntityQueryId = Number('-1'),
    commandBuffer = [],
    elapsedTicks = Number('0'),
    elapsedTime = Number('0'),
    id = UidUtils.uuid(),
    isEnabled = Boolean(true),
    isRunning = Boolean(false),
    startTime = Number('0'),
    stopTime = Number('0'),
    tags = [],
    world = null,
  } = {}) {
    this.state = {
      cachedEntityQuery,
      cachedEntityQueryId,
      commandBuffer,
      elapsedTicks,
      elapsedTime,
      id,
      isEnabled,
      isRunning,
      startTime,
      stopTime,
      tags,
      world,
    };
    this.topicId = PublishSubscribeUtils.createTopic({
      name: `${this.constructor.name}-${id}`,
    });
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async afterCycle() {
    const { state } = this;
    const { isEnabled, isRunning } = state;
    if (!isEnabled && isRunning) {
      this.state.isRunning = Boolean(false);
      this.state.stopTime = Date.now();
      await this.onStop();
    }
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async beforeCycle() {
    const { state } = this;
    const { isEnabled, isRunning } = state;
    if (isEnabled && !isRunning) {
      this.state.isRunning = Boolean(true);
      this.state.startTime = Date.now();
      await this.onStart();
    }
  }

  /**
   * @async
   * @param {Function} bufferCommand
   * @returns {Promise<void>}
   */
  async bufferCommand(bufferCommand) {
    const { state } = this;
    const { commandBuffer } = state;
    commandBuffer.push(bufferCommand);
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async cycle() {
    // before cycle
    await this.beforeCycle();

    // only update if running
    const { state } = this;
    const { isRunning } = state;
    if (isRunning) {
      const updateStart = Date.now();

      await this.beforeUpdate();
      await this.update();
      await this.afterUpdate();

      // analytics
      const updateEnd = Date.now();
      const runtime = updateEnd - updateStart;
      this.state.elapsedTicks += 1;
      this.state.elapsedTime += runtime;
    }

    // after cycle
    await this.afterCycle();
  }

  /**
   * @async
   * @returns {Promise<any>[]}
   */
  async executeCommandBuffer() {
    const { state } = this;
    const { commandBuffer } = state;
    return Promise.all(
      Array.from(commandBuffer).map(async (command) => command()),
    );
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async fixedCycle() {
    // before fixed cycle
    await this.beforeCycle();

    // only update if running
    const { state } = this;
    const { isEnabled, isRunning } = state;
    if (isEnabled && isRunning) {
      const updateStart = Date.now();

      await this.beforeFixedUpdate();
      await this.fixedUpdate();
      await this.afterFixedUpdate();

      // track analytics
      const updateEnd = Date.now();
      const runtime = updateEnd - updateStart;
      this.state.elapsedTicks += 1;
      this.state.elapsedTime += runtime;
    }

    // after fixed cycle
    await this.afterCycle();
  }

  /**
   * @async
   * @param {Component[]} components
   * @returns {Promise<Entity[]>}
   */
  async getEntityQuery(components) {
    const { state: systemState } = this;
    const { cachedEntityQuery, cachedEntityQueryId, world } = systemState;
    const { state: worldState } = world;
    const { entityManager } = worldState;

    // get new entity query if cached is not latest
    const currentQueryId = entityManager.getQueryInstanceId();
    if (currentQueryId !== cachedEntityQueryId) {
      const result = await entityManager.query(components);
      this.state.cachedEntityQuery = result;
      this.state.cachedEntityQueryId = entityManager.getQueryInstanceId();
      return result;
    }

    // return cached query if there is no new data
    else {
      return cachedEntityQuery;
    }
  }

  async onCreate() {
    return null;
  }
  async onDestroy() {
    return null;
  }
  async onStart() {
    return null;
  }
  async onStop() {
    return null;
  }

  async beforeUpdate() {
    return null;
  }
  async update() {
    return null;
  }
  async afterUpdate() {
    return null;
  }

  async beforeFixedUpdate() {
    return null;
  }
  async fixedUpdate() {
    return null;
  }
  async afterFixedUpdate() {
    return null;
  }
}
export default ComponentSystem;
