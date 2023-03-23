class CacheUtils {
  static cache = window.localStorage;

  /**
   * @static
   * @param {String} key
   * @returns {any} value
   */
  static get(key) {
    return CacheUtils.cache[key];
  }

  /**
   * @static
   * @param {String} key
   * @param {any} value
   * @returns {void} void
   */
  static set(key, value) {
    CacheUtils.cache[key] = value;
  }
}
export default CacheUtils;
