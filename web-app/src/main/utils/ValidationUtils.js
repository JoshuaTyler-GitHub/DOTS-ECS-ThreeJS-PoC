// utils
import UidUtils from '@utils/UidUtils';

// cached functions
const hasProperty = Object.prototype.hasOwnProperty;

class ValidationUtils {
  static NUMBER_MAX_SAFE_INT = Number.MAX_SAFE_INTEGER;
  static NUMBER_MIN_SAFE_INT = Number.MIN_SAFE_INTEGER;
  static STRING_MAX_LENGTH_SMALL = Number('320');

  /**
   * array validation
   * not null and not undefined
   * has key "length"
   * value of "length" valid integer
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static array(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        hasProperty.call(value, 'length') &&
        ValidationUtils.integer(value.length)
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * array with unique elements validation
   * valid array
   * no elements are identical
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static arrayUnique(value) {
    try {
      const elements = [];
      if (!ValidationUtils.array(value)) {
        return false;
      } else {
        value.forEach((i) => {
          if (!elements.includes(i)) {
            elements.push(i);
          }
        });
        return value.length === elements.length;
      }
    } catch {
      return Boolean(false);
    }
  }

  /**
   * boolean validation
   * exists and String is 'true' or 'false'
   *
   * @param {any} value
   * @returns {Boolean}
   */
  static boolean(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        (String(value) === String('true') || String(value) === String('false'))
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * colorHex validation
   * valid string
   * first character must be a "#" character
   * length equals 4 or length equals 7
   * all characters must be one of the following:
   * - "A", "B", "C", "D", "E", "F", "#",
   * - "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static colorHex(value) {
    try {
      //  loose validity
      const isLooselyValid =
        ValidationUtils.string(value) &&
        String(value).startsWith('#') &&
        (String(value).length === Number('4') ||
          String(value).length === Number('7'));
      if (!isLooselyValid) return Boolean(false);

      // strict validity
      // prettier-ignore
      const validCharacters = [
        'A', 'B', 'C', 'D', 'E', 'F', '#',
        '0', '1', '2','3','4','5','6','7','8','9',
      ];
      let isCharactersValid = true;
      [...String(value).toUpperCase()].forEach((character) => {
        if (!validCharacters.includes(String(character))) {
          isCharactersValid = Boolean(false);
        }
      });
      return isCharactersValid;
    } catch {
      return Boolean(false);
    }
  }

  /**
   * colorRgb validation
   * valid integer
   * maximum value of 255
   * minimum value of 0
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static colorRgb(value) {
    try {
      return (
        ValidationUtils.integer(value) &&
        Number(value) <= Number('255') &&
        Number(value) >= Number('0')
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * contentType validation
   * valid String
   * value (toLowerCase) equals one of the following:
   * - "application/*"
   * - "application/gzip"
   * - "application/json"
   * - "application/pdf"
   * - "application/octet-stream"
   * - "application/xml"
   * - "application/x-www-form-urlencoded"
   * - "application/zip"
   * - "audio/mp3"
   * - "audio/mp4"
   * - "audio/wav"
   * - "image/jpeg"
   * - "image/png"
   * - "image/svg"
   * - "multipart/byteranges"
   * - "multipart/form-data"
   * - "text/*"
   * - "text/csv"
   * - "text/html"
   * - "text/plain"
   * - "video/mp4"
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static contentType(value) {
    try {
      return (
        ValidationUtils.string(value) &&
        [
          String('application/*'),
          String('application/gzip'),
          String('application/json'),
          String('application/pdf'),
          String('application/octet-stream'),
          String('application/xml'),
          String('application/x-www-form-urlencoded'),
          String('application/zip'),
          String('audio/mp3'),
          String('audio/mp4'),
          String('audio/wav'),
          String('image/jpeg'),
          String('image/png'),
          String('image/svg'),
          String('multipart/byteranges'),
          String('multipart/form-data'),
          String('text/*'),
          String('text/csv'),
          String('text/html'),
          String('text/plain'),
          String('video/mp4'),
        ].includes(String(value).toLowerCase())
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * email validation
   * valid string, less than 320 characters
   * does not contain whitespace
   * must contains only 1 "@" character
   * must contain at least 1 "." character
   * must have at least 1 character before the "@" character
   * must have at least 3 characters after the "@" character
   * suffix must contain at least 1 "." character
   * suffix must contain at least 1 character before, after, and between "." characters
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static email(value) {
    try {
      //  loose validity
      const isLooselyValid =
        ValidationUtils.stringSmall(value) &&
        String(value).trim().length === String(value).length &&
        String(value).split('@').length === Number('2') &&
        String(value).split('.').length >= Number('2');
      if (!isLooselyValid) return Boolean(false);

      // strict validity
      const [prefix, suffix] = String(value).split('@');

      // prefix
      const isPrefixValid = prefix.length >= Number('1');
      if (!isPrefixValid) return Boolean(false);

      // suffix (as a whole)
      const isSuffixWholeValid =
        suffix.length >= Number('3') && suffix.split('.').length >= Number('2');
      if (!isSuffixWholeValid) return Boolean(false);

      // suffix (in parts)
      const splitSuffix = suffix.split('.');
      for (const index in splitSuffix) {
        if (!splitSuffix[index] || splitSuffix[index].length < Number('1')) {
          return Boolean(false);
        }
      }
      return Boolean(true);
    } catch {
      return Boolean(false);
    }
  }

  /**
   * exists validation
   * not null and not undefined
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static exists(value) {
    try {
      return (
        value !== null &&
        value !== undefined &&
        String(value) !== String('null') &&
        String(value) !== String('undefined')
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * float validation
   * valid string
   * is a parsable float
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static float(value) {
    try {
      return ValidationUtils.string(value) && !isNaN(parseFloat(value));
    } catch {
      return Boolean(false);
    }
  }

  /**
   * generic type validation
   * valid string
   * value equals one of the following:
   * - "double"
   * - "float"
   * - "integer"
   * - "long"
   * - "string"
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
   static genericType(value) {
    try {
      return (
        ValidationUtils.string(value) &&
        (String(value) === 'double' ||
          String(value) === 'float' ||
          String(value) === 'integer' ||
          String(value) === 'long' ||
          String(value) === 'string')
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * image validation
   * valid exists
   * state.metadata.model-type is 'Image'
   * valid imageSources
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static image(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        hasProperty.call(value, 'state') &&
        ValidationUtils.imageState(value.state) &&
        ValidationUtils.imageSources(value.state.sources)
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * imageArray validation
   * valid array
   * foreach valid image
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static imageArray(value) {
    try {
      if (!ValidationUtils.array(value)) {
        return Boolean(false);
      } else {
        let isValid = Boolean(true);
        for (const index in value) {
          if (!ValidationUtils.image(value[index])) {
            isValid = Boolean(false);
            break;
          }
        }
        return isValid;
      }
    } catch {
      return Boolean(false);
    }
  }

  /**
   * imageState validation
   * valid exists
   * metadata.model-type is 'Image'
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static imageState(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        ValidationUtils.exists(value.metadata) &&
        ValidationUtils.exists(value.metadata['model-type']) &&
        String(value.metadata['model-type']) === String('Image')
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * imageSources validation
   * valid exists
   * valid strings
   * at least one of the following sizes:
   *  - full
   *  - large
   *  - medium
   *  - small
   *  - thumb
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static imageSources(value) {
    try {
      const isLooselyValid = ValidationUtils.exists(value);
      if (!isLooselyValid) return Boolean(false);

      // source sizes
      const sizes = ['full', 'large', 'medium', 'small', 'thumb'];

      let hasValidSize = Boolean(false);
      for (const index in sizes) {
        if (sizes[index]) {
          const size = sizes[index];
          if (ValidationUtils.string(value[size])) {
            hasValidSize = Boolean(true);
            break;
          }
        }
      }
      return hasValidSize;
    } catch {
      return Boolean(false);
    }
  }

  /**
   * integer validation
   * valid string
   * is a parsable integer
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static integer(value) {
    try {
      return (
        ValidationUtils.string(value) &&
        !isNaN(parseInt(value)) &&
        parseInt(value) <= ValidationUtils.NUMBER_MAX_SAFE_INT &&
        parseInt(value) >= ValidationUtils.NUMBER_MIN_SAFE_INT
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * latitude, longitude validation
   * not null and not undefined
   * has key "lat"
   * has key "lng"
   * "lat" is a valid float
   * "lng" is a valid float
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static latLng(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        hasProperty.call(value, 'lat') &&
        hasProperty.call(value, 'lng') &&
        ValidationUtils.float(value.lat) &&
        ValidationUtils.float(value.lng)
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * notificationType validation
   * valid string
   * value equals one of the following:
   * - "primary"
   * - "secondary"
   * - "info"
   * - "success"
   * - "warning"
   * - "danger"
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static notificationType(value) {
    try {
      return (
        ValidationUtils.string(value) &&
        (String(value) === 'primary' ||
          String(value) === 'secondary' ||
          String(value) === 'info' ||
          String(value) === 'success' ||
          String(value) === 'warning' ||
          String(value) === 'danger')
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * number validation
   * valid float
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static number(value) {
    return ValidationUtils.float(value);
  }

  /**
   * password validation
   * valid string, less than 320 characters
   * at least 8 characters
   * cannot contain whitespace
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static password(value) {
    try {
      return (
        ValidationUtils.stringSmall(value) &&
        String(value).length >= Number('8') &&
        String(value).trim().length === String(value).length
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * pov validation
   * not null and not undefined
   * has key "heading"
   * has key "pitch"
   * has key "zoom"
   * "heading" is a valid float
   * "pitch" is a valid float
   * "zoom" is a valid float
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static pov(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        hasProperty.call(value, 'heading') &&
        hasProperty.call(value, 'pitch') &&
        hasProperty.call(value, 'zoom') &&
        ValidationUtils.float(value.heading) &&
        ValidationUtils.float(value.pitch) &&
        ValidationUtils.float(value.zoom)
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * streetView validation
   * not null and not undefined
   * has key "position"
   * has key "pov"
   * "position" is a valid latLng
   * "pov" is a valid pov
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static streetView(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        hasProperty.call(value, 'position') &&
        hasProperty.call(value, 'pov') &&
        ValidationUtils.latLng(value.position) &&
        ValidationUtils.pov(value.pov)
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * string validation
   * not null and not undefined
   * string is not "[object Object]"
   * string is not empty or only whitespace
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static string(value) {
    try {
      return (
        ValidationUtils.exists(value) &&
        String(value).trim() !== '[object Object]' &&
        String(value).trim() !== ''
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * stringSmall validation
   * valid string
   * string length is less than 320
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static stringSmall(value) {
    try {
      return (
        ValidationUtils.string(value) &&
        String(value).length <= ValidationUtils.STRING_MAX_LENGTH_SMALL
      );
    } catch {
      return Boolean(false);
    }
  }

  /**
   * url validation
   * valid string, less than 320 characters
   * does not contain whitespace
   * must contain at least 1 "." character
   * must have at least 1 character before the last "." character
   * must have at least 1 character after the last "." character
   * must contain at least 1 character before, after, and between all "." characters
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static url(value) {
    try {
      //  loose validity
      const isLooselyValid =
        ValidationUtils.stringSmall(value) &&
        String(value).trim().length === String(value).length &&
        String(value).split('.').length >= Number('2');
      if (!isLooselyValid) return Boolean(false);

      // strict validity
      const prefix = String(value).substring(0, String(value).lastIndexOf('.'));
      const suffix = String(value).substring(
        String(value).lastIndexOf('.') + 1,
      );

      // prefix
      const isPrefixValid = prefix.length >= Number('1');
      if (!isPrefixValid) return Boolean(false);

      // suffix
      const isSuffixValid = suffix.length >= Number('1');
      if (!isSuffixValid) return Boolean(false);

      // multi-domain (more than 1 ".")
      const splitDomains = String(value).split('.');
      for (const index in splitDomains) {
        if (!splitDomains[index] || splitDomains[index].length < Number('1')) {
          return Boolean(false);
        }
      }
      return Boolean(true);
    } catch {
      return Boolean(false);
    }
  }

  /**
   * uuid validation
   * valid stringSmall
   * handled by uuide node_module
   *
   * @static
   * @param {any} value
   * @returns {Boolean}
   */
  static uuid(value) {
    try {
      return ValidationUtils.stringSmall(value) && UidUtils.validate(value);
    } catch {
      return Boolean(false);
    }
  }
}
export default ValidationUtils;
