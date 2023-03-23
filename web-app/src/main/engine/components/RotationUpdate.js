// engine - components
import Component from '@engine/components/Component';

class RotationUpdate extends Component {
  constructor({
    x = Number('0'),
    y = Number('0'),
    z = Number('0'),
    isFixed = true,
    isOverride = false,
    isPersistent = false,
  } = {}) {
    super();
    this.isFixed = isFixed;
    this.isOverride = isOverride;
    this.isPersistent = isPersistent;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
export default RotationUpdate;
