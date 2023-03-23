// node_modules
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

class UidUtils {
  /**
   * @static
   * @returns {String} uuidV4
   */
  static _private_uuid() {
    return uuidV4();
  }

  /**
   * @static
   * @returns {String} serialVersionUid
   */
  static _private_serialVersionUID() {
    const id = Array(19).fill().map(() => Math.floor(Math.random() * 10));
    id[0] = Math.max(1, Math.min(8, id[0]));
    return id.join('');
  }

  /**
   * @static
   * @param {String} uuid
   * @returns {Boolean}
   */
  static validate(uuid) {
    return uuidValidate(uuid);
  }

  /**
   * @static
   * @param {Array} uuidsInUse
   * @returns {String} serialVersionUid
   */
  static serialVersionUID(uuidsInUse) {
    let id = UidUtils._private_serialVersionUID();
    if (uuidsInUse) {
      while (uuidsInUse.includes(id)) {
        id = UidUtils._private_serialVersionUID();
      }
    }
    return id;
  }

  /**
   * @static
   * @param {Array} uuidsInUse
   * @returns {String} uuid
   */
  static uuid(uuidsInUse) {
    let uuid = UidUtils._private_uuid();
    if (uuidsInUse) {
      while (uuidsInUse.includes(uuid)) {
        uuid = UidUtils._private_uuid();
      }
    }
    return uuid;
  }
}
export default UidUtils;
