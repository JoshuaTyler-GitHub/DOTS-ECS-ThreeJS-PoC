// node_modules
import * as THREE from 'three';

// engine - components
import Rotation from '@engine/components/Rotation';
import RotationUpdate from '@engine/components/RotationUpdate';

// engine - systems
import RenderSystem from '@engine/systems/RenderSystem';
import RotationSystem from '@engine/systems/RotationSystem';

// game - managers
import GameManager from '@game/managers/GameManager';

// game - position-layouts
import GamePositionLayout from '@game/position-layouts/GamePositionLayout';

// game - scenes
import GameScene from '@game/scenes/GameScene';

/**
 * @prop {HTMLCanvasElement} canvas
 */
class GameTestScene extends GameScene {
  constructor() {
    super();

    // scene
    const scene = new THREE.Scene();

    // cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // systems
    const world = GameManager.worlds['main'];
    world.addSystem(new RenderSystem());
    world.addSystem(new RotationSystem());
    world.start();

    // entities
    const cubeEntity = world.state.entityManager.create([
      new Rotation(cube.rotation),
      new RotationUpdate({ x: 0.5, y: 0.5, z: 0.5, isPersistent: true }),
    ]);

    // position-layout
    const positionLayout = new GamePositionLayout();

    this.state = {
      cube,
      cubeEntity,
      positionLayout,
      scene,
      world,
    };
  }
}
export default GameTestScene;
