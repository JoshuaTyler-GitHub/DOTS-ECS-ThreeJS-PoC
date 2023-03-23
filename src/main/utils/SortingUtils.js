// utils
import StringUtils from '@utils/StringUtils';

// constants
const STYLE_IDENTIFIER_END = ';"';
const STYLE_IDENTIFIER_SPLIT = '; ';
const STYLE_IDENTIFIER_START = 'style="';

class SortingUtils {
  /**
   * @static
   * @param {String} styleString
   * @returns {String} alphabetizedStyleString
   */
  static alphabetizeStyleSequences(styleString) {
    const parseString = String(styleString);

    // get sequences
    const sequences = StringUtils.findStartSequenceAndEndSequencePositions(
      String(STYLE_IDENTIFIER_START),
      String(STYLE_IDENTIFIER_END),
      String(parseString),
    );

    // replace sequences
    if (sequences.length > Number('0')) {
      let lastSequenceEnd = Number('0');
      let reassemblyString = '';

      for (const sequenceIndex in sequences) {
        if (sequences[sequenceIndex]) {
          const sequence = sequences[sequenceIndex];

          // fill reassemblyString between sequences
          reassemblyString += parseString.substring(
            lastSequenceEnd,
            sequence.start,
          );

          // sort sequence and append to reassemblyString
          const preSortedStyles = parseString.substring(
            sequence.start,
            sequence.end,
          );
          const strippedStyles = preSortedStyles
            .replace(STYLE_IDENTIFIER_START, '')
            .replace(STYLE_IDENTIFIER_END, '')
            .split(STYLE_IDENTIFIER_SPLIT);
          const sortedStyles = SortingUtils.sortAscending(
            strippedStyles,
            'valueOf',
          );
          const postSortedStyles =
            `${STYLE_IDENTIFIER_START}` +
            `${sortedStyles.join(STYLE_IDENTIFIER_SPLIT)}` +
            `${STYLE_IDENTIFIER_END}`;
          reassemblyString += postSortedStyles;
          lastSequenceEnd = sequence.end;
        }
      }

      // fill reassemblyString after all sequences appended
      reassemblyString += parseString.substring(lastSequenceEnd);
      return reassemblyString;
    }
    return styleString;
  }

  /**
   * @static
   * @param {Array} array
   * @param {String} getterA
   * @param {String} getterB
   * @param {Boolean} isAscending
   * @returns {Array | String}
   */
  // prettier-ignore
  static sort(array, getterA, getterB, isAscending = false) {
    const compareA = getterA || String('valueOf');
    const compareB = getterB || compareA;
    return array.sort((a, b) => {
      const comparatorA = a[compareA] instanceof Function ? a[compareA]() : a[compareA];
      const comparatorB = b[compareB] instanceof Function ? b[compareB]() : b[compareB];
      if (comparatorA > comparatorB) return isAscending ? 1 : -1;
      if (comparatorA < comparatorB) return isAscending ? -1 : 1;
      return 0;
    });
  }

  /**
   * @static
   * @param {Array} array
   * @param {String} getterA
   * @param {String} getterB
   * @returns {Array | String}
   */
  static sortAscending(array, getterA, getterB) {
    return SortingUtils.sort(array, getterA, getterB, true);
  }

  /**
   * @static
   * @param {Array} array
   * @param {String} getterA
   * @param {String} getterB
   * @returns {Array | String}
   */
  static sortDescending(array, getterA, getterB) {
    return SortingUtils.sort(array, getterA, getterB, false);
  }
}
export default SortingUtils;
