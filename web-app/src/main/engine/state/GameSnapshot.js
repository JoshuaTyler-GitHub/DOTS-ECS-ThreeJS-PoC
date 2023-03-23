// utils
import UidUtils from '@utils/UidUtils';

class GameSnapshot {
  constructor({ positions = {} } = {}) {
    this.state = {
      id: String(`scene-${UidUtils.uuid()}`),
      positions,
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
   * @returns {Object} serializableState
   */
  getSerializableState() {
    const { state } = this;
    const { id, positions } = state;

    // positions
    const serializablePositions = {};
    Object.entries(positions).forEach(([key, value]) => {
      serializablePositions[key] = value.getSerializableState();
    });

    return {
      id: String(id),
      positions: serializablePositions,
    };
  }
}
export default GameSnapshot;
