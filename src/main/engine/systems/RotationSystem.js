// components
import Rotation from '@engine/components/Rotation';
import RotationUpdate from '@engine/components/RotationUpdate';

// core
import ComponentSystem from '@engine/systems/ComponentSystem';

class RotationSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  async fixedUpdate() {
    const { state: systemState } = this;
    const { world } = systemState;
    const { state: worldState } = world;
    const { entityManager, timeData } = worldState;
    const { fixedDeltaTime } = timeData;

    const entites = await this.getEntityQuery([
      Rotation.prototype,
      RotationUpdate.prototype,
    ]);

    await Promise.all(
      Array.from(entites).map(async (entity) => {
        const rotationComponent = entity.components[Rotation.name];
        const rotationUpdateComponent = entity.components[RotationUpdate.name];

        const { rotation } = rotationComponent;
        const { x, y, z, isFixed, isOverride, isPersistent } =
          rotationUpdateComponent;

        // override rotation
        if (Boolean(isOverride)) {
          rotation.x = Number(x);
          rotation.y = Number(y);
          rotation.z = Number(z);
        }

        // add to rotation
        else {
          // fixed timescale
          if (Boolean(isFixed)) {
            rotation.x += Number(x) * Number(fixedDeltaTime);
            rotation.y += Number(y) * Number(fixedDeltaTime);
            rotation.z += Number(z) * Number(fixedDeltaTime);
          }

          // unfixed timescale
          else {
            rotation.x += Number(x);
            rotation.y += Number(y);
            rotation.z += Number(z);
          }
        }

        // remove if not a persisting change
        if (!Boolean(isPersistent)) {
          this.bufferCommand(
            entityManager.removeComponent(entity, RotationUpdate.name),
          );
        }
      }),
    );
  }
}
export default RotationSystem;
