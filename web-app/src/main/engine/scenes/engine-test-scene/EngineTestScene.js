// node_modules
import * as THREE from 'three';

// engine - components
import Rotation from '@engine/components/Rotation';
import RotationUpdate from '@engine/components/RotationUpdate';

// engine - scenes
import EngineScene from '@engine/scenes/EngineScene';

// engine - systems
import RenderSystem from '@engine/systems/RenderSystem';
import RotationSystem from '@engine/systems/RotationSystem';

/**
 * @prop {HTMLCanvasElement} canvas
 */
class EngineTestScene extends EngineScene {
  constructor(props) {
    super(props);
    const { state } = this;
    const { scene, world } = state;

    // cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x3f7b9d });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // systems
    world.addSystem(new RenderSystem());
    world.addSystem(new RotationSystem());

    // entities
    const cubeEntity = world.state.entityManager.create([
      new Rotation(cube.rotation),
      new RotationUpdate({ x: 0.5, y: 0.5, z: 0.5, isPersistent: true }),
    ]);

    this.state = {
      ...state,
      cube,
      cubeEntity,
    };
  }
}
export default EngineTestScene;
