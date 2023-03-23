// utils
import ValidationUtils from '@utils/ValidationUtils';

class ObjectUtils {
  /**
   * @recursive
   * @static
   * @param {Object} objectNew
   * @param {Object} objectOld
   * @param {String[]} ignoreKeys
   * @returns {Object}
   */
  static changeSet(objectNew = {}, objectOld = {}, ignoreKeys = []) {
    const keys = Object.keys({ ...objectNew, ...objectOld });
    const changeSet = {};
    keys.forEach((key) => {
      let recursionRequired = Boolean(false);

      // stringify new values
      let newString = String('undefined');
      if (ValidationUtils.exists(objectNew[key])) {
        if (ValidationUtils.string(objectNew[key])) {
          newString = String(objectNew[key]);
        } else {
          recursionRequired = Boolean(true);
        }
      }

      // stringify old values
      let oldString = String('undefined');
      if (ValidationUtils.exists(objectOld[key])) {
        if (ValidationUtils.string(objectOld[key])) {
          oldString = String(objectOld[key]);
        } else {
          recursionRequired = Boolean(true);
        }
      }

      // recurse if needed
      if (recursionRequired) {
        const resursiveChangeSet = ObjectUtils.changeSet(
          objectNew[key],
          objectOld[key],
        );
        if (Object.keys(resursiveChangeSet).length > 0) {
          changeSet[key] = { ...resursiveChangeSet };
        }
      }

      // othwerwise, add to changeSet
      else if (String(newString) !== String(oldString)) {
        changeSet[key] = {};
        if (ValidationUtils.exists(objectNew[key])) {
          changeSet[key].new = objectNew[key];
        }
        if (ValidationUtils.exists(objectOld[key])) {
          changeSet[key].old = objectOld[key];
        }
      }
    });
    return changeSet;
  }

  /**
   * @recursive
   * @static
   * @param {Object} object
   * @param {String[]} ignoreKeys
   * @returns {Number}
   */
  static deepEntriesCount(object = {}, ignoreKeys = []) {
    let entriesCount = Number('0');
    const keys = Object.keys(object);
    if (keys.length > 0) {
      const recursiveEntriesCounts = keys.map((key) => {
        if (!ignoreKeys.includes(key)) {
          entriesCount++;
          if (object[key] instanceof Object) {
            return ObjectUtils.deepEntriesCount(object[key], ignoreKeys);
          }
        }
        return Number('0');
      });
      recursiveEntriesCounts.forEach((count) => (entriesCount += count));
    }
    return entriesCount;
  }

  /**
   * @recursive
   * @static
   * @param {Object} object
   * @param {String[]} filterKeys
   * @param {Boolean} isExclusive
   * @returns {Object}
   */
  static deepFilterKeys(object, filterKeys = [], isExclusive = Boolean(false)) {
    const filteredObject = {};
    Object.entries(object).forEach(([key, value]) => {
      if (
        (isExclusive && !filterKeys.includes(key)) ||
        (!isExclusive && filterKeys.includes(key))
      ) {
        if (value instanceof Object) {
          filteredObject[key] = ObjectUtils.deepFilterKeys(
            value,
            filterKeys,
            isExclusive,
          );
        } else {
          filteredObject[key] = value;
        }
      }
    });
    return filteredObject;
  }

  /**
   * @recursive
   * @static
   * @param {Object} object
   * @param {String[]} filterValues
   * @param {Boolean} isExclusive
   * @returns {Object}
   */
  static deepFilterValues(
    object,
    filterValues = [],
    isExclusive = Boolean(false),
  ) {
    const filteredObject = {};
    Object.entries(object).forEach(([key, value]) => {
      if (
        (isExclusive && !filterValues.includes(value)) ||
        (!isExclusive && filterValues.includes(value))
      ) {
        if (value instanceof Object) {
          filteredObject[key] = ObjectUtils.deepFilterValues(
            value,
            filterValues,
            isExclusive,
          );
        } else {
          filteredObject[key] = value;
        }
      }
    });
    return filteredObject;
  }

  /**
   * @recursive
   * @static
   * @param {Object} object
   * @param {String[]} ignoreKeys
   * @param {Boolean} ignoreDuplicates
   * @returns {Array<any>}
   */
  static deepValues(
    object = {},
    ignoreKeys = [],
    ignoreDuplicates = Boolean(false),
  ) {
    const finalValues = [];
    const entries = Object.entries(object);
    if (entries.length > 0) {
      const recursiveValues = entries.map(([key, value]) => {
        if (!ignoreKeys.includes(key)) {
          if (value instanceof Object) {
            return ObjectUtils.deepValues(value, ignoreKeys, ignoreDuplicates);
          } else {
            return [value];
          }
        } else {
          return [];
        }
      });

      recursiveValues.forEach((values) => {
        values.forEach((value) => {
          const isDuplicate = Boolean(finalValues.includes(value));
          const isIgnored = Boolean(ignoreDuplicates && isDuplicate);
          if (!isIgnored) {
            finalValues.push(value);
          }
        });
      });
    }
    return finalValues;
  }

  /**
   * @recursive
   * @static
   * @param {Object} object
   * @param {String} delimiter
   * @returns {Object} flattenedObject
   */
  static flatten(object = {}, delimiter = String('.')) {
    const flattenedObject = {};
    Object.entries(object).forEach(([key, value]) => {
      if (value instanceof Object) {
        const flattenedValue = ObjectUtils.flatten(value, delimiter);
        Object.entries(flattenedValue).forEach(([flattenedKey, value]) => {
          flattenedObject[`${key}${delimiter}${flattenedKey}`] = value;
        });
      } else {
        flattenedObject[key] = value;
      }
    });
    return flattenedObject;
  }

  /**
   * @recursive
   * @static
   * @param {Object} object
   * @returns {Object} reversedObject
   */
  static reverse(object = {}) {
    const reversedObject = {};
    Object.entries(object).forEach(([key, value]) => {
      if (value instanceof Object) {
        reversedObject[key] = ObjectUtils.reverse(value);
      } else {
        reversedObject[value] = key;
      }
    });
    return reversedObject;
  }
}
export default ObjectUtils;
