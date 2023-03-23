// engine - state
import getInitialInstanceState from '@engine/state/initial-states/InitialInstanceState';

// logger
import LoggerFactory from '@logger/Logger';

class GameStateReducers {
  static log = LoggerFactory.create(GameStateReducers);

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onCameraProjectionUpdate(state, action) {
    // TAG ACTION
    // state update intentionally not implemented
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onCanvasManagerAdd(state, action) {
    // TAG ACTION
    // state update intentionally not implemented
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onCanvasManagerSelect(state, action) {
    const { payload } = action;
    const { canvasManagerId } = payload;
    state.activeCanvasManagerId = String(canvasManagerId);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onGameSnapshot(state, action) {
    const { payload } = action;
    const { gameSnapshot } = payload;
    const gameSnapshotClone = { ...gameSnapshot };
    state.gameSnapshot = gameSnapshotClone;
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onGameSnapshotHistory(state, action) {
    const { gameSnapshotHistory } = state;
    const { payload } = action;
    const { gameSnapshot } = payload;
    const gameSnapshotClone = { ...gameSnapshot };
    gameSnapshotHistory.push(gameSnapshotClone);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onGameSnapshotHistoryClear(state, action) {
    const { gameSnapshotHistory } = getInitialInstanceState();
    state.gameSnapshotHistory = new Array(1).fill(gameSnapshotHistory);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onNewGame(state, action) {
    // TAG ACTION
    // state update intentionally not implemented
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onRendererSizeUpdate(state, action) {
    const { payload } = action;
    const { height, width } = payload;
    state.displayHeight = Number(height);
    state.displayWidth = Number(width);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onResize(state, action) {
    // TAG ACTION
    // state update intentionally not implemented
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onResizeIgnored(state, action) {
    // TAG ACTION
    // state update intentionally not implemented
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onSceneAdd(state, action) {
    // TAG ACTION
    // state update intentionally not implemented
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onSceneLoadStart(state, action) {
    const { payload } = action;
    const { sceneId } = payload;
    // TODO scene loading
    GameStateReducers.log.debug(
      `onSceneLoadStart() - TODO scene loading, sceneId: ${sceneId}.`,
    );
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onSceneSelect(state, action) {
    const { payload } = action;
    const { sceneId } = payload;
    state.activeSceneId = String(sceneId);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onStart(state, action) {
    state.isRunning = Boolean(true);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onStop(state, action) {
    state.isRunning = Boolean(false);
  }

  /**
   * @param {state} state
   * @param {action} action
   * @returns {void}
   */
  static onWorldSelect(state, action) {
    const { payload } = action;
    const { worldId } = payload;
    state.activeWorldId = String(worldId);
  }
}
export default GameStateReducers;
