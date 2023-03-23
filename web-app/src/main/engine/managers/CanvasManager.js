// node_modules
import { WebGLRenderer } from 'three';

// engine - managers
import EngineManager from '@engine/managers/EngineManager';

// utils
import DomEventUtils from '@utils/DomEventUtils';
import UidUtils from '@utils/UidUtils';

class CanvasManager {
  constructor(props) {
    this.state = {
      canvasElement: null,
      canvasHeight: Number('0'),
      canvasWidth: Number('0'),
      elementHeight: String('100%'),
      elementOffsetX: Number('0'),
      elementOffsetY: Number('0'),
      elementWidth: String('100%'),
      elementZIndex: Number('-1'),
      forceUpdateCallback: () => {},
      id: String(`CanvasManager-${UidUtils.uuid()}`),
      isActive: Boolean(false),
      renderer: null,
    };

    // canvas listeners
    this.onCanvasReady = () => {};

    // dom listeners
    this.resizeSubscriberId = DomEventUtils.subscribe('resize', () =>
      this.resize(),
    );
  }

  /**
   * @param {HTMLCanvasElement} canvasElement
   * @param {Function} forceUpdateCallback
   * @returns {void} void
   */
  initialize(canvasElement, forceUpdateCallback) {
    const { state } = this;
    state.canvasElement = canvasElement;
    state.renderer = new WebGLRenderer({ canvas: canvasElement });
    state.forceUpdateCallback = forceUpdateCallback;
    this.resize();
  }

  /**
   * @returns {HTMLCanvasElement} canvas
   */
  getCanvasElement() {
    const { state } = this;
    const { canvasElement } = state;
    return canvasElement;
  }

  /**
   * @returns {String} id
   */
  getId() {
    const { state } = this;
    const { id } = state;
    return String(id);
  }

  /**
   * @returns {Boolean} isActive
   */
  getIsActive() {
    const { state } = this;
    const { isActive } = state;
    return Boolean(isActive);
  }

  /**
   * @returns {WebGLRenderer} renderer
   */
  getRenderer() {
    const { state } = this;
    const { renderer } = state;
    return renderer;
  }

  /**
   * @returns {void}
   */
  resize() {
    const { state } = this;
    const { canvasElement, id, forceUpdateCallback } = state;

    // calculate resized height & width
    const pixelRatio = window.devicePixelRatio || Number('1');
    const canvasHeight = canvasElement.clientHeight * pixelRatio;
    const canvasWidth = canvasElement.clientWidth * pixelRatio;

    // only resize if needed
    if (
      canvasElement.height !== canvasHeight ||
      canvasElement.width !== canvasWidth
    ) {
      state.canvasHeight = canvasHeight;
      state.canvasWidth = canvasWidth;
      EngineManager.resize(id, canvasHeight, canvasWidth);
      forceUpdateCallback();
    }
  }

  /**
   * @param {Boolean} isActive
   * @returns {void} void
   */
  setIsActive(isActive) {
    const { state } = this;
    state.isActive = Boolean(isActive);
  }
}
export default CanvasManager;
