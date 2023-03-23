// components
import Scale from '@engine/components/Scale';
import ScaleUpdate from '@engine/components/ScaleUpdate';

// core
import ComponentSystem from '@engine/systems/ComponentSystem';

class ScaleSystem extends ComponentSystem {
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
      Scale.prototype,
      ScaleUpdate.prototype,
    ]);

    await Promise.all(
      Array.from(entites).map(async (entity) => {
        const transformComponent = entity.components[Scale.name];
        const transformUpdateComponent = entity.components[ScaleUpdate.name];

        const { scale } = transformComponent;
        const { x, y, z, isFixed, isOverride, isPersistent } =
          transformUpdateComponent;

        // override scale
        if (Boolean(isOverride)) {
          scale.x = Number(x);
          scale.y = Number(y);
          scale.z = Number(z);
        }

        // add to scale
        else {
          // fixed timescale
          if (Boolean(isFixed)) {
            scale.x += Number(x) * Number(fixedDeltaTime);
            scale.y += Number(y) * Number(fixedDeltaTime);
            scale.z += Number(z) * Number(fixedDeltaTime);
          }

          // unfixed timescale
          else {
            scale.x += Number(x);
            scale.y += Number(y);
            scale.z += Number(z);
          }
        }

        // remove if not a persisting change
        if (!Boolean(isPersistent)) {
          this.bufferCommand(
            entityManager.removeComponent(entity, ScaleUpdate.name),
          );
        }
      }),
    );
  }
}
export default ScaleSystem;
