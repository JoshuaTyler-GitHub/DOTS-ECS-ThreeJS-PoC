// positions
import GamePosition from '@game/positions/GamePosition';

// constants
const DEFAULT_COLUMNS = Number('8');
const DEFAULT_ROWS = Number('5');

class GamePositionLayout {
  constructor({ positions = null } = {}) {
    this.state = {
      positions,
    };
  }

  /**
   * @param {Number} columns
   * @param {Number} rows
   * @returns {GamePositionLayout}
   */
  create(columns = DEFAULT_COLUMNS, rows = DEFAULT_ROWS) {
    const positions = {};
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        positions[`${c}-${r}`] = new GamePosition({
          column: Number(c),
          row: Number(r),
        });
      }
    }
    return positions;
  }
}
export default GamePositionLayout;
