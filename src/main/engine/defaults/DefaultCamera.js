// node_modules
import { PerspectiveCamera } from 'three';

const DEFAULT_CAMERA_PARAMS = {
  aspect: Number('1'),
  far: Number('1000'),
  fov: Number('75'),
  near: Number('0.1'),
};

const getDefaultCamera = () => {
  const camera = new PerspectiveCamera(
    DEFAULT_CAMERA_PARAMS.fov,
    DEFAULT_CAMERA_PARAMS.aspect,
    DEFAULT_CAMERA_PARAMS.near,
    DEFAULT_CAMERA_PARAMS.far,
  );
  camera.position.z = 5;
  return camera;
};
export default getDefaultCamera;
