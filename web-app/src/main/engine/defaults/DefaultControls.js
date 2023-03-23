// engine - resources
import CONTROLS from '@engine/resources/controls.json';

// constants
const DEFAULT_CONTROL_STATES = {
  keydown: {
    defaultState: { isActive: Boolean(false) },
  },
  keyup: { defaultState: { isActive: Boolean(false) }, type: String('keyup') },
  mousedown: {
    defaultState: { isActive: Boolean(false) },
  },
  mouseup: {
    defaultState: { isActive: Boolean(false) },
  },
  mousemove: {
    defaultState: { x: Number('0'), y: Number('0') },
  },
  wheel: {
    defaultState: {
      deltaMode: WheelEvent.DOM_DELTA_PIXEL,
      deltaX: Number('0'),
      deltaY: Number('0'),
      deltaZ: Number('0'),
    }
  },
};

const getDefaultControls = () => {
  const { keydown, keyup, mousedown, mouseup, mousemove, wheel } =
    DEFAULT_CONTROL_STATES;
  return {
    camera: {
      backward: {
        codes: [CONTROLS.keyboard.keyS.code],
        types: { keydown, keyup },
      },
      fastMove: {
        codes: [CONTROLS.keyboard.keyShiftLeft.code],
        types: { keydown, keyup },
      },
      forward: {
        codes: [CONTROLS.keyboard.keyW.code],
        types: { keydown, keyup },
      },
      left: { codes: [CONTROLS.keyboard.keyA.code], types: { keydown, keyup }},
      right: { codes: [CONTROLS.keyboard.keyD.code], types: { keydown, keyup }},
      rotateX: { codes: [CONTROLS.mouse.axis.x.code], types: { mousemove }},
      rotateY: { codes: [CONTROLS.mouse.axis.y.code], types: { mousemove }},
    },
    mouse: {
      button1: {
        codes: [CONTROLS.mouse.buttons['1'].code],
        types: { mousedown, mouseup },
      },
      button2: {
        codes: [CONTROLS.mouse.buttons['2'].code],
        types: { mousedown, mouseup },
      },
      button3: {
        codes: [CONTROLS.mouse.buttons['3'].code],
        types: { mousedown, mouseup },
      },
      rotateX: { codes: [CONTROLS.mouse.axis.x.code], types: { mousemove }},
      rotateY: { codes: [CONTROLS.mouse.axis.y.code], types: { mousemove }},
      zoom: { codes: [CONTROLS.mouse.axis.z.code], types: { wheel }},
    },
  };
};
export default getDefaultControls;
