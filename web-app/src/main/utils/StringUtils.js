class StringUtils {
  /**
   * @static
   * @param {String} sequence
   * @param {String} stringToParse
   * @returns {Array<Number>}
   */
  static findSequencePositions(sequence, stringToParse) {
    const parseSequence = String(sequence);
    const parseString = String(stringToParse);
    const containsSequence = parseString.includes(parseSequence.valueOf());

    // only perform computation if string contains sequence
    if (!containsSequence) return [];

    // find sequence locations
    const sequencePositions = [];
    let currentPosition = 0;
    while (currentPosition < parseString.length) {
      const subString = parseString.substring(currentPosition);
      const sequenceSubStringPosition = subString.search(parseSequence);
      const sequencePosition = sequenceSubStringPosition + currentPosition;
      if (sequenceSubStringPosition === -1) break; // break if not found
      sequencePositions.push(Number(sequencePosition));
      currentPosition = sequencePosition + parseSequence.length;
    }
    return sequencePositions;
  }

  /**
   * @static
   * @param {String} startSequence
   * @param {String} endSequence
   * @param {String} stringToParse
   * @returns {Array<Object>}
   */
  // prettier-ignore
  static findStartSequenceAndEndSequencePositions(
    startSequence,
    endSequence,
    stringToParse,
  ) {
    const _endSequence = String(endSequence);
    const _startSequence = String(startSequence);
    const parseString = String(stringToParse);
    const containsEndSequence = parseString.includes(_endSequence.valueOf());
    const containsStartSequence = parseString.includes(
      _startSequence.valueOf(),
    );

    // only perform comp if string contains sequences
    if (!containsEndSequence || !containsStartSequence) return [];

    const sequencePositions = [];

    // find sequence locations
    let currentPosition = 0;
    while (currentPosition < parseString.length) { // NOSONAR - multiple break statements warning
      
      // start sequence
      const startSubString = parseString.substring(currentPosition);
      const startSequenceSubStringPosition =
        startSubString.search(_startSequence);
      if (startSequenceSubStringPosition === -1) break; // break if not found
      const startSequencePosition =
        startSequenceSubStringPosition + currentPosition;

      // end sequence
      const endSubStringStart = startSequencePosition + _startSequence.length;
      const endSubString = parseString.substring(endSubStringStart);
      const endSequenceSubStringPosition = endSubString.search(_endSequence);
      if (endSequenceSubStringPosition === -1) break; // break if not found
      const endSequencePosition =
        endSequenceSubStringPosition + endSubStringStart;
      const endSequencePositionWithLength =
        endSequencePosition + _endSequence.length;

      // update positions
      sequencePositions.push({
        end: Number(endSequencePositionWithLength),
        start: Number(startSequencePosition),
      });
      currentPosition = endSequencePositionWithLength;
    }
    return sequencePositions;
  }

  /**
   * @static
   * @param {String} sequence
   * @returns {String} sequenceModified
   */
  static lowerFirstChar(sequence) {
    const firstChar = String(sequence).substring(0, 1);
    const allAfter = String(sequence).substring(1);
    return String(`${firstChar.toLowerCase()}${allAfter}`);
  }

  /**
   * @static
   * @param {String} sequence
   * @returns {String} sequenceModified
   */
  static upperFirstChar(sequence) {
    const firstChar = String(sequence).substring(0, 1);
    const allAfter = String(sequence).substring(1);
    return String(`${firstChar.toUpperCase()}${allAfter}`);
  }
}
export default StringUtils;
