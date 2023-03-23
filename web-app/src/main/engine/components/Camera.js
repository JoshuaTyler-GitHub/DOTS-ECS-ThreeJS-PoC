// engine - components
import Component from '@engine/components/Component';

class Camera extends Component {
  constructor({
    aspect = Number('1'),
    far = Number('1000'),
    filmGuage = Number('35'),
    filmOffset = Number('0'),
    fov = Number('75'),
    frustumCulled = Boolean(true),
    near = Number('0.1'),
    zoom = Number('1'),
  } = {}) {
    super();
    this.aspect = aspect;
    this.far = far;
    this.filmGuage = filmGuage;
    this.filmOffset = filmOffset;
    this.fov = fov;
    this.frustumCulled = frustumCulled;
    this.near = near;
    this.zoom = zoom;
  }
}
export default Camera;
