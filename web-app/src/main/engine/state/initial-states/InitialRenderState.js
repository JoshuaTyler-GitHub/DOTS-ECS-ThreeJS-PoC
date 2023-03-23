const getInitialRenderState = () => {
  return {
    activeCanvasManagerId: String('main'),
    activeRendererId: String('main'),
    displayHeight: Number('0'),
    displayWidth: Number('0'),
  };
};
export default getInitialRenderState;
