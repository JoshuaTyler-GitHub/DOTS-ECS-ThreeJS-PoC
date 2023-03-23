// engine - resources
import CONTROLS from '@engine/resources/controls.json';

const getInitialControlsState = () => {
  return {
    gamepadPanLeft: String('TBD'),
    keyboardPanLeft: String(CONTROLS.keyboard.keyA.keyCode),
  };
};
export default getInitialControlsState;
