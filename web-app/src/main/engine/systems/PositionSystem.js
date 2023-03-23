// components
import Position from '@engine/components/Position';
import PositionUpdate from '@engine/components/PositionUpdate';

// core
import ComponentSystem from '@engine/systems/ComponentSystem';

class PositionSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {void}
   */
  async fixedUpdate() {
    const { state: systemState } = this;
    const { world } = systemState;
    const { state: worldState } = world;
    const { entityManager, timeData } = worldState;
    const { fixedDeltaTime } = timeData;

    const entites = await this.getEntityQuery([
      Position.prototype,
      PositionUpdate.prototype,
    ]);

    await Promise.all(
      Array.from(entites).map(async (entity) => {
        const positionComponent = entity.components[Position.name];
        const positionUpdateComponent = entity.components[PositionUpdate.name];

        const { position } = positionComponent;
        const { x, y, z, isFixed, isOverride, isPersistent } =
          positionUpdateComponent;

        // override position
        if (Boolean(isOverride)) {
          position.x = Number(x);
          position.y = Number(y);
          position.z = Number(z);
        }

        // add to position
        else {
          // fixed timescale
          if (Boolean(isFixed)) {
            position.x += Number(x) * Number(fixedDeltaTime);
            position.y += Number(y) * Number(fixedDeltaTime);
            position.z += Number(z) * Number(fixedDeltaTime);
          }

          // unfixed timescale
          else {
            position.x += Number(x);
            position.y += Number(y);
            position.z += Number(z);
          }
        }

        // remove if not a persisting change
        if (!Boolean(isPersistent)) {
          this.bufferCommand(
            entityManager.removeComponent(entity, PositionUpdate.name),
          );
        }
      }),
    );
  }
}
export default PositionSystem;
