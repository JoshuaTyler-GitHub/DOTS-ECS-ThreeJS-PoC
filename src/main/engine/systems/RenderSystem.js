// engine - managers
import EngineManager from '@engine/managers/EngineManager';

// engine - state
import { Store } from '@engine/state/GameState';

// engine - systems
import ComponentSystem from '@engine/systems/ComponentSystem';

class RenderSystem extends ComponentSystem {
  /**
   * @async
   * @override
   * @returns {Promise<void>}
   */
  async update() {
    const { instance } = Store.getState();
    const { activeSceneId } = instance;
    const scene = EngineManager.scenes[activeSceneId];
    const threeScene = scene.getThreeScene();
    await Promise.all(
      Object.values(EngineManager.canvasManagers).map(async (canvasManager) => {
        if (canvasManager.getIsActive()) {
          const renderer = canvasManager.getRenderer();
          await Promise.all(
            Object.values(EngineManager.cameras).map(async (camera) => {
              renderer.render(threeScene, camera);
            }),
          );
        }
      }),
    );
  }
}
export default RenderSystem;
