// components
import Gravity from 'icarus/components/Gravity';
import PositionUpdate from 'icarus/components/PositionUpdate';
import RotationUpdate from 'icarus/components/RotationUpdate';
import ScaleUpdate from 'icarus/components/ScaleUpdate';

class PhysicsFactory {
  /**
   * @async
   * @static
   * @param {String[]} archetype
   * @param {Object} physicsParameters
   * @returns {Component[]}
   */
  static async assignComponents(archetype, physicsParameters) {
    const { components: archetypeComponents } = archetype;
    const components = [];

    // gravity
    if (archetypeComponents.includes('Gravity')) {
      components.push(new Gravity());
    }

    // positionUpdate
    if (archetypeComponents.includes('PositionUpdate')) {
      components.push(new PositionUpdate(physicsParameters.positionUpdate));
    }

    // rotation
    if (archetypeComponents.includes('RotationUpdate')) {
      components.push(new RotationUpdate(physicsParameters.rotationUpdate));
    }

    // scale
    if (archetypeComponents.includes('ScaleUpdate')) {
      components.push(new ScaleUpdate(physicsParameters.scaleUpdate));
    }

    return components;
  }

  /**
   * @async
   * @static
   * @param {Object} prefab
   * @returns {Component[]}
   */
  static async build(prefab) {
    const { archetype, parameters } = prefab;
    const { physics: physicsParameters } = parameters;
    return PhysicsFactory.assignComponents(archetype, physicsParameters);
  }
}
export default PhysicsFactory;
