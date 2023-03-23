// node_modules
import { Scene } from 'three';

// engine - managers
import EngineManager from '@engine/managers/EngineManager';

// engine - state
import GameSnapshot from '@engine/state/GameSnapshot';

// utils
import UidUtils from '@utils/UidUtils';

class EngineScene {
  constructor({
    id = null,
    scene = new Scene(),
    world = EngineManager.worlds['main'],
  } = {}) {
    const uid = String(`EngineScene-${UidUtils.uuid()}`);
    this.state = {
      id: id ? String(id) : String(uid),
      scene,
      uid,
      world,
    };
  }

  /**
   * @returns {String} id
   */
  getId() {
    const { state } = this;
    const { id } = state;
    return String(id);
  }

  /**
   * @returns {GameSnapshot} gameSnapshot
   */
  getInitialGameSnapshot() {
    return new GameSnapshot();
  }

  /**
   * @returns {Object} state
   */
  getState() {
    const { state } = this;
    return state;
  }

  /**
   * @returns {Scene} threeScene
   */
  getThreeScene() {
    const { state } = this;
    const { scene } = state;
    return scene;
  }
}
export default EngineScene;
