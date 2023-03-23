// node_modules
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

// components
import Position from '@engine/components/Position';
import Rotation from '@engine/components/Rotation';
import Scale from '@engine/components/Scale';

// errors
import InvalidGeometryTypeError from '@engine/errors/InvalidGeometryTypeError';
import InvalidMaterialTypeError from '@engine/errors/InvalidMaterialTypeError';

// utils
import ValidationUtils from '@utils/ValidationUtils';

class MeshFactory {
  /**
   * @static
   * @param {Mesh} mesh
   * @param {String[]} archetype
   * @returns {Component[]}
   */
  static assignComponents(mesh, archetype) {
    const { components: archetypeComponents } = archetype;
    const components = [];

    // position
    if (archetypeComponents.includes('Position')) {
      components.push(new Position(mesh.position));
    }

    // rotation
    if (archetypeComponents.includes('Rotation')) {
      components.push(new Rotation(mesh.rotation));
    }

    // scale
    if (archetypeComponents.includes('Scale')) {
      components.push(new Scale(mesh.scale));
    }

    return components;
  }

  /**
   * @static
   * @param {Object} geometryParameters
   * @returns {Geometry}
   * @throws {InvalidGeometryTypeError}
   */
  static assignGeometry(geometryParameters) {
    if (ValidationUtils.exists(geometryParameters.type)) {
      const {
        depth,
        depthSegments,
        height,
        heightSegments,
        type,
        width,
        widthSegments,
      } = geometryParameters;

      // box
      if (type.valueOf() === 'box') {
        return new BoxGeometry(
          width,
          height,
          depth,
          widthSegments,
          heightSegments,
          depthSegments,
        );
      }

      // other

      // unknown
      else {
        throw new InvalidGeometryTypeError(
          `[MeshFactory] assignGeometry() - Unkown geometry parameter "type": [${type}].`,
        );
      }
    } else {
      throw new InvalidGeometryTypeError(
        `[MeshFactory] assignGeometry() - Undefined geometry parameter "type".`,
      );
    }
  }

  /**
   * @static
   * @param {Object} materialParameters
   * @returns {Material}
   * @throws {InvalidMaterialTypeError}
   */
  static assignMaterial(materialParameters) {
    if (ValidationUtils.exists(materialParameters.type)) {
      const { parameters, type } = materialParameters;

      // box
      if (type.valueOf() === 'basic') {
        return new MeshBasicMaterial(parameters);
      }

      // other

      // unkown
      else {
        throw new InvalidMaterialTypeError(
          `[MeshFactory] assignMaterial() - Unknown material parameter "type": [${type}].`,
        );
      }
    } else {
      throw new InvalidMaterialTypeError(
        '[MeshFactory] assignMaterial() - Undefined material parameter "type".',
      );
    }
  }

  /**
   * @static
   * @param {Scene} scene
   * @param {Object} prefab
   * @returns {Component[]}
   * @throws {InvalidGeometryTypeError}
   * @throws {InvalidMaterialTypeError}
   */
  static build(scene, prefab) {
    const { archetype, parameters } = prefab;
    const { mesh: meshParameters } = parameters;
    const { geometry: geometryParameters, material: materialParameters } =
      meshParameters;
    const geometry = MeshFactory.assignGeometry(geometryParameters);
    const material = MeshFactory.assignMaterial(materialParameters);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
    return MeshFactory.assignComponents(mesh, archetype);
  }
}
export default MeshFactory;
