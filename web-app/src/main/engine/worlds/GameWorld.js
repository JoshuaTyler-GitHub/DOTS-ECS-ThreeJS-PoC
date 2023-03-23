// core
import EntityManager from '@engine/managers/EntityManager';

// errors
import DuplicateSystemError from '@engine/errors/DuplicateSystemError';
import InvalidSystemError from '@engine/errors/InvalidSystemError';
import SystemNotFoundError from '@engine/errors/SystemNotFoundError';
import WorldAlreadyCreatedError from '@engine/errors/WorldAlreadyCreatedError';

// logger
import LoggerFactory from '@logger/Logger';

// systems
import ComponentSystem from '@engine/systems/ComponentSystem';

// utils
import { MILLISECONDS } from '@utils/MathUtils';
import UidUtils from '@utils/UidUtils';
import ValidationUtils from '@utils/ValidationUtils';

// constants
const DELTA_TIME_PRECISION = Number('3');

class GameWorld {
  constructor({
    id = null,
    systems = {},
    tags = [],
    timeData = {
      cycleStart: Number('0'),
      cyclesPerSecond: Number('0'),
      deltaTime: Number('0'),
      fixedDeltaTime: Number('0'),
      lastCycleStart: Date.now(),
      lastFixedCycleStart: Date.now(),
      maxCyclesPerSecond: Number('1000'),
      maxFixedCyclesPerSecond: Number('100'),
      minCycleInterval: Number('1'),
      minFixedCycleInterval: Number('10'),
      worldStart: Number('0'),
      worldStop: Number('0'),
    },
  } = {}) {
    const uid = String(`GameWorld-${UidUtils.uuid()}`);
    this.state = {
      entityManager: new EntityManager({ world: this }),
      cycleIntervalId: null,
      isCreated: Boolean(false),
      isCycleInProgress: Boolean(false),
      isRunning: Boolean(false),
      id: id ? String(id) : String(uid),
      systems,
      tags,
      timeData,
      uid,
    };
  }

  static log = LoggerFactory.create(GameWorld);

  /**
   * @async
   * @param {ComponentSystem} system
   * @returns {Promise<void>}
   * @throws {DuplicateSystemError}
   * @throws {InvalidSystemError}
   */
  async addSystem(system) {
    // verify system argument
    if (!(system instanceof ComponentSystem)) {
      throw new InvalidSystemError(
        GameWorld,
        `addSystem() - System [${system}] is not an instanceof [ComponentSystem].`,
      );
    }

    // verify a system with this name does not exist
    const systemName = String(system.constructor.name);
    if (this.systemsInclude(systemName)) {
      throw new DuplicateSystemError(
        GameWorld,
        'addSystem() - cannot create duplicate system.',
      );
    }

    // add the system to the world
    else {
      system.state.world = this;
      this.state.systems[systemName] = system;
      await this.onSystemCreate(system);
      await system.onCreate();
    }
  }

  /**
   * @async
   * @returns {Promise<EntityManager>}
   * @throws {WorldAlreadyCreatedError}
   */
  async create() {
    const { state } = this;
    const { id, isCreated, entityManager } = state;
    if (!isCreated) {
      state.isCreated = Boolean(true);
      await this.onCreate();
      return entityManager;
    } else {
      throw new WorldAlreadyCreatedError(
        GameWorld,
        `create() - GameWorld [${id}] has already been created.`,
      );
    }
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async cycleSystems() {
    const { state } = this;
    const { isRunning, timeData } = state;
    const {
      lastCycleStart,
      lastFixedCycleStart,
      minCycleInterval,
      minFixedCycleInterval,
    } = timeData;

    // only cycle system if the world isRunning value is true
    if (isRunning) {
      // track the world cycle start
      const cycleStart = Date.now();
      const timeSinceLastCycle = cycleStart - lastCycleStart;
      const timeSinceLastFixedCycle = cycleStart - lastFixedCycleStart;

      // ignore this system cycle if not enough time has elapsed since the previous cycle
      const isCycleIgnored = timeSinceLastCycle < minCycleInterval;

      // ignore this system fixed cycle if not enough time has elapsed since the previous fixed cycle
      const isFixedCycleIgnored =
        timeSinceLastFixedCycle < minFixedCycleInterval;

      // update the time data for this cycle
      timeData.cycleStart = cycleStart;
      timeData.cyclesPerSecond = Math.floor(MILLISECONDS / timeSinceLastCycle);
      timeData.deltaTime = Number(timeSinceLastCycle / MILLISECONDS).toFixed(3);
      timeData.fixedDeltaTime = Number(
        timeSinceLastFixedCycle / MILLISECONDS,
      ).toFixed(DELTA_TIME_PRECISION);

      // execute system cycles
      const cycles = [];
      if (!isCycleIgnored) {
        timeData.lastCycleStart = cycleStart;
        cycles.push(this.executeSystemCycle());
      }
      if (!isFixedCycleIgnored) {
        timeData.lastFixedCycleStart = cycleStart;
        cycles.push(this.executeSystemFixedCycle());
      }
      await Promise.all(cycles);

      // execute buffered system commands
      await this.executeSystemCommandBuffers();
    }
  }

  /**
   * @returns {EntityManager}
   */
  getEntityManager() {
    const { state } = this;
    const { entityManager } = state;
    return entityManager;
  }

  /**
   * @param {String} systemName
   * @returns {ComponentSystem}
   * @throws {SystemNotFoundError}
   */
  getSystem(systemName) {
    if (this.systemsInclude(systemName)) {
      return this.state.systems[systemName];
    } else {
      throw new SystemNotFoundError(
        GameWorld,
        `getSystem() - No system found with name [${systemName}].`,
      );
    }
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async executeSystemCommandBuffers() {
    const { state } = this;
    const { systems } = state;
    await Promise.all(
      Array.from(systems).map((system) => system.executeCommandBuffer()),
    );
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async executeSystemCycle() {
    const { state } = this;
    const { systems } = state;
    await Promise.all(Object.values(systems).map((system) => system.cycle()));
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async executeSystemFixedCycle() {
    const { state } = this;
    const { systems } = state;
    await Promise.all(
      Object.values(systems).map((system) => system.fixedCycle()),
    );
  }

  /**
   * @async
   * @param {String} systemName
   * @returns {Promise<void>}
   * @throws {SystemNotFoundError}
   */
  async removeSystem(systemName) {
    const system = this.getSystem(systemName);
    await this.onSystemDestroy(system);
    await system.onDestroy();
    delete this.state.systems[systemName];
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async start() {
    const { state } = this;
    const { isRunning, timeData } = state;
    if (!isRunning) {
      // onStart lifecycle hook
      await this.onStart();

      // set timeData
      const worldStart = Date.now();
      timeData.lastCycleStart = worldStart;
      timeData.lastFixedCycleStart = worldStart;
      timeData.worldStart = worldStart;

      // create cycle interval
      state.cycleIntervalId = setInterval(async () => {
        if (!state.isCycleInProgress) {
          state.isCycleInProgress = true;
          await this.cycleSystems();
          state.isCycleInProgress = false;
        }
      }, 1);

      // update isRunning
      state.isRunning = true;
    }
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async stop() {
    const { state } = this;
    const { cycleIntervalId, isRunning } = state;
    if (isRunning) {
      // update isRunning
      this.state.isRunning = false;

      // clear cycle interval
      clearInterval(cycleIntervalId);

      // set timeData
      this.state.timeData.worldStop = Date.now();

      // onStop lifecycle hook
      await this.onStop();
    }
  }

  /**
   * @param {String} systemName
   * @returns {Boolean}
   */
  systemsInclude(systemName) {
    const { state } = this;
    const { systems } = state;
    return ValidationUtils.exists(systems[systemName]);
  }

  async onCreate() {}
  async onDestroy() {}

  async onStart() {}
  async onStop() {}

  async onSystemCreate() {}
  async onSystemDestroy() {}
}
export default GameWorld;
