// node_modules
import _ from 'lodash';

// engine - defaults
import getDefaultCamera from '@engine/defaults/DefaultCamera';
import getDefaultWorld from '@engine/defaults/DefaultWorld';

// engine - errors
import DuplicateCanvasManagerError from '@engine/errors/DuplicateCanvasManagerError';
import DuplicateSceneError from '@engine/errors/DuplicateSceneError';
import DuplicateWorldError from '@engine/errors/DuplicateWorldError';
import InvalidArgumentError from '@engine/errors/InvalidArgumentError';
import StaticAccessError from '@engine/errors/StaticAccessError';

// engine - managers
import CanvasManager from '@engine/managers/CanvasManager';

// engine - scenes
import EngineScene from '@engine/scenes/EngineScene';

// engine - state
import { Actions, Dispatch, Store } from '@engine/state/GameState';

// utils
import ValidationUtils from '@utils/ValidationUtils';
import GameWorld from '@engine/worlds/GameWorld';

// constants
const RESIZE_MINIMUM_WAIT_TIME = Number('50');

class EngineManager {
  constructor() {
    throw new StaticAccessError(
      EngineManager,
      'constructor() - Attempted to create a new EngineManager, it should be accessed statically.',
    );
  }

  static cameras = { main: getDefaultCamera() };
  static canvasManagers = {};
  static scenes = {};
  static worlds = { main: getDefaultWorld() };

  /**
   * @static
   * @param {CanvasManager} canvasManager
   * @returns {void}
   * @throws {DuplicateCanvasManagerError}
   * @throws {InvalidArgumentError}
   */
  static addCanvasManager(canvasManager) {
    if (
      ValidationUtils.exists(canvasManager) &&
      canvasManager instanceof CanvasManager
    ) {
      const canvasManagerId = canvasManager.getId();
      if (
        !ValidationUtils.exists(EngineManager.canvasManagers[canvasManagerId])
      ) {
        EngineManager.canvasManagers[canvasManagerId] = canvasManager;
        Dispatch(Actions.addCanvasManager({ canvasManagerId }));
      } else {
        throw new DuplicateCanvasManagerError(
          EngineManager,
          `addCanvasManager() - Invalid argument "canvasManger", EngineManager.canvasManagers already contains a CanvasManager for ID: ${canvasManagerId}.`,
        );
      }
    } else {
      throw new InvalidArgumentError(
        EngineManager,
        'addCanvasManager() - Invalid argument "canvasManger", not an instance of CanvasManager.',
      );
    }
  }

  /**
   * @static
   * @param {Scene} scene
   * @returns {void}
   * @throws {DuplicateSceneError}
   * @throws {InvalidArgumentError}
   */
  static addScene(scene) {
    if (ValidationUtils.exists(scene) && scene instanceof EngineScene) {
      const sceneId = scene.getId();
      if (!ValidationUtils.exists(EngineManager.scenes[sceneId])) {
        EngineManager.scenes[sceneId] = scene;
        Dispatch(Actions.addScene({ sceneId }));
      } else {
        throw new DuplicateSceneError(
          `[EngineManager] addScene() - Invalid argument "scene", EngineManager.scenes already contains a EngineScene for ID: ${sceneId}.`,
        );
      }
    } else {
      throw new InvalidArgumentError(
        '[EngineManager] addScene() - Invalid argument "scene", not an instance of EngineScene.',
      );
    }
  }

  /**
   * @static
   * @param {GameWorld} world
   * @returns {void}
   * @throws {DuplicateWorldError}
   * @throws {InvalidArgumentError}
   */
  static addWorld(world) {
    if (ValidationUtils.exists(world) && world instanceof GameWorld) {
      const worldId = world.getId();
      if (!ValidationUtils.exists(EngineManager.worlds[worldId])) {
        EngineManager.worlds[worldId] = world;
        Dispatch(Actions.addWorld({ worldId }));
      } else {
        throw new DuplicateWorldError(
          EngineManager`addWorld() - Invalid argument "world", EngineManager.worlds already contains a GameWorld for ID: ${worldId}.`,
        );
      }
    } else {
      throw new InvalidArgumentError(
        EngineManager,
        'addWorld() - Invalid argument "world", not an instance of GameWorld.',
      );
    }
  }

  /**
   * @static
   * @param {String} sceneId
   * @returns {void}
   */
  static loadScene(sceneId) {
    Dispatch(Actions.loadScene({ sceneId }));
  }

  /**
   * @static
   * @returns {void}
   */
  static newGame() {
    const { instance } = Store.getState();
    const { activeSceneId } = instance;
    const activeScene = EngineManager.scenes[activeSceneId];
    const gameSnapshot = activeScene.getInitialGameSnapshot();
    Dispatch(Actions.newGame());
    Dispatch(Actions.clearGameHistory());
    EngineManager.updateGameState(gameSnapshot);
  }

  /**
   * @static
   * @param {CanvasManager} canvasManager
   * @param {EngineScene} scene
   * @returns {void}
   */
  static newInstance(canvasManager, scene) {
    // CanvasManager
    const canvasManagerId = canvasManager.getId();
    EngineManager.addCanvasManager(canvasManager);
    EngineManager.selectCanvasManager(canvasManagerId);

    // EngineScene
    const sceneId = scene.getId();
    EngineManager.addScene(scene);
    EngineManager.loadScene(sceneId);
    EngineManager.selectScene(sceneId);

    // GameSnapshot
    EngineManager.newGame();
  }

  /**
   * @static
   * @param {String} canvasManagerId
   * @param {Number} height
   * @param {Number} width
   * @returns {void}
   */
  static resize(canvasManagerId, height, width) {
    const { render } = Store.getState();
    const { activeCanvasManagerId } = render;

    // only perform expensive resize if active canvas
    if (canvasManagerId === activeCanvasManagerId) {
      Dispatch(Actions.resize({ canvasManagerId, height, width }));
      EngineManager.updateRendererSize(height, width);
      EngineManager.updateCameraProjectionMatrix(height, width);
    } else {
      Dispatch(Actions.resizeIgnored({ canvasManagerId, height, width }));
    }
  }

  /**
   * @static
   * @param {String} canvasManagerId
   * @returns {void}
   */
  static selectCanvasManager(canvasManagerId) {
    EngineManager.canvasManagers[canvasManagerId].setIsActive(true);
    for (const _canvasManagerId in EngineManager.canvasManagers) {
      if (
        canvasManagerId !== _canvasManagerId &&
        EngineManager.canvasManagers[_canvasManagerId].getIsActive()
      ) {
        EngineManager.canvasManagers[_canvasManagerId].setIsActive(false);
      }
    }
    Dispatch(Actions.selectCanvasManager({ canvasManagerId }));
  }

  /**
   * @static
   * @param {String} sceneId
   * @returns {void}
   */
  static selectScene(sceneId) {
    Dispatch(Actions.selectScene({ sceneId }));
  }

  /**
   * @static
   * @param {String} worldId
   * @returns {void}
   */
  static selectWorld(worldId) {
    Dispatch(Actions.selectWorld({ worldId }));
  }

  /**
   * @static
   * @returns {void}
   */
  static start() {
    const { instance } = Store.getState();
    const { activeWorldId } = instance;
    const activeWorld = EngineManager.worlds[activeWorldId];
    Dispatch(Actions.start());
    activeWorld.start();
  }

  /**
   * @static
   * @returns {void}
   */
  static stop() {
    const { instance } = Store.getState();
    const { activeWorldId } = instance;
    const activeWorld = EngineManager.worlds[activeWorldId];
    Dispatch(Actions.stop());
    activeWorld.stop();
  }

  /**
   * @static
   * @param {Number} height
   * @param {Number} width
   * @returns {void}
   */
  static updateCameraProjectionMatrix(height, width) {
    Dispatch(Actions.updateCameraProjection({ height, width }));
    for (const key in EngineManager.cameras) {
      EngineManager.cameras[key].aspect = width / height;
      EngineManager.cameras[key].updateProjectionMatrix();
    }
  }

  /**
   * @static
   * @param {GameSnapshot} gameSnapshot
   * @returns {void}
   */
  static updateGameState(gameSnapshot) {
    const serializableGameSnapshot = gameSnapshot.getSerializableState();
    Dispatch(
      Actions.updateGameState({
        gameSnapshot: serializableGameSnapshot,
      }),
    );
    Dispatch(
      Actions.updateGameHistory({
        gameSnapshot: serializableGameSnapshot,
      }),
    );
  }

  /**
   * @static
   * @param {Number} height
   * @param {Number} width
   * @returns {void}
   */
  static updateRendererSize(height, width) {
    Dispatch(Actions.updateRendererSize({ height, width }));
    for (const canvasManagerId in EngineManager.canvasManagers) {
      const canvasManager = EngineManager.canvasManagers[canvasManagerId];
      canvasManager.getRenderer().setSize(width, height, false);
    }
  }
}
export default EngineManager;

// debounce resize handler
EngineManager.resize = _.debounce(
  EngineManager.resize.bind(EngineManager),
  RESIZE_MINIMUM_WAIT_TIME,
  { trailing: true },
);
