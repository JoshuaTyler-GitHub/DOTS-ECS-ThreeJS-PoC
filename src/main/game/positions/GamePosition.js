class GamePosition {
  constructor({
    building = null,
    column = null,
    row = null,
    unit = null
  } = {}) {
    this.state = {
      building,
      column,
      row,
      unit,
    };
  }
}
export default GamePosition;
