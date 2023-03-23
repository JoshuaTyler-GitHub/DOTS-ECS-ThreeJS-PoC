// engine - defaults
import getDefaultControls from '@engine/defaults/DefaultControls';

// utils
import CacheUtils from '@utils/CacheUtils';
import DomEventUtils from '@utils/DomEventUtils';
import ObjectUtils from '@utils/ObjectUtils';

// constants
const LOCAL_STORAGE_KEY = String('user-settings-engine-controls');

class EngineInputController {
  static gamepads = navigator.getGamepads();
  static state = EngineInputController.initialize();
w
  /**
   * @static
   * @returns {Object} state
   */
  static initialize() {
    // TODO: check controls does not have conflicts from version to version
    const defaultControlsConfig = getDefaultControls();
    const localControlsConfig = CacheUtils.get(LOCAL_STORAGE_KEY) || {};
    const controls = {
      ...defaultControlsConfig,
      ...localControlsConfig,
    };

    // initialize control states
    const controlStates =
      EngineInputController.initializeControlStates(controls);
    console.log('controlStates', controlStates);

    const flattenedControls = ObjectUtils.flatten(controls);
    const reverseLookup = ObjectUtils.reverse(flattenedControls);
    const eventListeners =
      EngineInputController.initializeEventListeners(controls);

    return controls;
  }

  /**
   * @static
   * @param {Object} controls
   * @returns {Object} eventListeners
   */
  static initializeControlStates(controls) {
    const controlStates = {};
    Object.entries(controls).forEach(([controlGroupKey, controlGroupValue]) => {
      controlStates[controlGroupKey] = {};
      Object.entries(controlGroupValue).forEach(
        ([controlKey, controlValue]) => {
          const { types } = controlValue;
          controlStates[controlGroupKey][controlKey] = {};
          Object.entries(types).forEach(([typeKey, typeValue]) => {
            const { defaultState } = typeValue;
            controlStates[controlGroupKey][controlKey][typeKey] = { ...defaultState };
          });
        },
      );
    });
    return controlStates;
  }

  /**
   * @static
   * @param {Object} controls
   * @returns {Object} eventListeners
   */
  static initializeEventListeners(controls) {
    Object.entries(controls).forEach(([controlGroupKey, controlGroupValue]) => {
      Object.entries(controlGroupValue).forEach(
        ([controlKey, controlValue]) => {
          const { codes, types } = controlValue;
          // types.forEach((eventType) => {
          //   const subscriberId = DomEventUtils.subscribe(eventType, (event) => {
          //     const { code } = event;
          //     if (codes.includes(code)) {
          //     }
          //   });
          // });
        },
      );
    });
  }

  static handleKeyDown = (event) => {
    const { code } = event;
    // EngineInputController.controlsReverseLookup[code]
  };
}
export default EngineInputController;
