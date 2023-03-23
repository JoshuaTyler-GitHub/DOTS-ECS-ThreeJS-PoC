// node_modules
import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';

// errors
import StaticAccessError from '@errors/StaticAccessError';

// engine - state
import GameStateReducers from './GameStateReducers';
import getInitialControlsState from '@engine/state/initial-states/InitialControlsState';
import getInitialEnvironmentState from '@engine/state/initial-states/InitialEnvironmentState';
import getInitialInstanceState from '@engine/state/initial-states/InitialInstanceState';
import getInitialRendererState from '@engine/state/initial-states/InitialRenderState';

// game - resources
import CONFIG from '@game/resources/config.json';
import CONSTANTS from '@game/resources/constants.json';

/**
 * reduxjs-toolkit state management class
 *
 * @typedef {Object.<string, any>} action
 * @typedef {Object.<string, any>} state
 */
class GameState {
  constructor() {
    throw new StaticAccessError(
      '[GameState] constructor() - Attempted to create a new GameState, it should be accessed statically.',
    );
  }

  /**
   * redux slices
   */
  // controls slice
  static controlsSlice = createSlice({
    name: String(CONSTANTS.slices.game.controls),
    initialState: getInitialControlsState(),
    reducers: {
      setGamepadPanLeft: (state, action) => {},
      setKeyboardPanLeft: (state, action) => {},
    },
  });

  // environment slice
  static environmentSlice = createSlice({
    name: String(CONSTANTS.slices.game.environment),
    initialState: getInitialEnvironmentState(),
    reducers: {
      setEnvironment: (state, action) => {},
    },
  });

  // instance slice
  static instanceSlice = createSlice({
    name: String(CONSTANTS.slices.game.instance),
    initialState: getInitialInstanceState(),
    reducers: {
      addScene: GameStateReducers.onSceneAdd,
      clearGameHistory: GameStateReducers.onGameSnapshotHistoryClear,
      initialize: (state, action) => {},
      loadScene: GameStateReducers.onSceneLoadStart,
      newGame: GameStateReducers.onNewGame,
      selectScene: GameStateReducers.onSceneSelect,
      selectWorld: GameStateReducers.onWorldSelect,
      start: GameStateReducers.onStart,
      stop: GameStateReducers.onStop,
      updateGameState: GameStateReducers.onGameSnapshot,
      updateGameHistory: GameStateReducers.onGameSnapshotHistory,
    },
  });

  // render slice
  static renderSlice = createSlice({
    name: String(CONSTANTS.slices.game.render),
    initialState: getInitialRendererState(),
    reducers: {
      addCanvasManager: GameStateReducers.onCanvasManagerAdd,
      resize: GameStateReducers.onResize,
      resizeIgnored: GameStateReducers.onResizeIgnored,
      selectCanvasManager: GameStateReducers.onCanvasManagerSelect,
      updateCameraProjection: GameStateReducers.onCameraProjectionUpdate,
      updateRendererSize: GameStateReducers.onRendererSizeUpdate,
    },
  });

  /**
   * redux store
   */
  // actions
  static actions = {
    ...GameState.controlsSlice.actions,
    ...GameState.environmentSlice.actions,
    ...GameState.instanceSlice.actions,
    ...GameState.renderSlice.actions,
  };

  // store
  static store = configureStore({
    devTools: CONFIG.environment !== 'production',
    reducer: combineReducers({
      controls: GameState.controlsSlice.reducer,
      environment: GameState.environmentSlice.reducer,
      instance: GameState.instanceSlice.reducer,
      render: GameState.renderSlice.reducer,
    }),
  });

  // dispatch
  static dispatch = GameState.store.dispatch;
}
export default GameState;
export const Actions = GameState.actions;
export const Dispatch = GameState.dispatch;
export const Store = GameState.store;
