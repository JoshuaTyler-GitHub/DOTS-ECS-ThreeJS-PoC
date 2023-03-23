// constants
const MILLISECONDS = Number('1000');

class MathUtils {
  /**
   * @param {Number} lower
   * @param {Number} upper
   * @returns {Number}
   */
  static random(lower, upper) {
    const difference = upper - lower;
    const random = Math.random();
    return lower + difference * random;
  }
}
export default MathUtils;
export { MILLISECONDS };
