// node_modules
import * as THREE from 'three';

// editor - managers
import EditorManager from '@editor/managers/EditorManager';

// editor - scenes
import EditorScene from '@editor/scenes/EditorScene';

// engine - components
import InputControlTag from '@engine/components/InputControlTag';
import Position from '@engine/components/Position';
import PositionUpdate from '@engine/components/PositionUpdate';
import Rotation from '@engine/components/Rotation';
import RotationUpdate from '@engine/components/RotationUpdate';

// engine - systems
import CameraFreeControlSystem from '@engine/systems/CameraFreeControlSystem';
import PositionSystem from '@engine/systems/PositionSystem';
import RenderSystem from '@engine/systems/RenderSystem';
import RotationSystem from '@engine/systems/RotationSystem';

/**
 * @prop {HTMLCanvasElement} canvas
 */
class EngineTestScene extends EditorScene {
  constructor(props) {
    super(props);
    const { state } = this;
    const { scene, world } = state;

    // background
    scene.background = new THREE.Color(1, 1, 1);

    // cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x3f7b9d });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // grid helper
    const gridHelper = new THREE.GridHelper( 10, 10 );
    scene.add( gridHelper );

    // systems
    world.addSystem(new CameraFreeControlSystem());
    world.addSystem(new PositionSystem());
    world.addSystem(new RenderSystem());
    world.addSystem(new RotationSystem());

    // entity - camera
    const mainCamera = EditorManager.cameras['main'];
    world.state.entityManager.create([
      new InputControlTag(),
      new Position(mainCamera.position),
      new PositionUpdate({ y: 3, z: 5, isOverride: true }),
      new Rotation(mainCamera.rotation),
      new RotationUpdate({ x: -0.33, isOverride: true }),
    ]);

    // entity - cube
    world.state.entityManager.create([
      new Position(cube.position),
      new Rotation(cube.rotation),
      new RotationUpdate({ x: 0.5, y: 0.5, z: 0.5, isPersistent: true }),
    ]);
  }
}
export default EngineTestScene;
