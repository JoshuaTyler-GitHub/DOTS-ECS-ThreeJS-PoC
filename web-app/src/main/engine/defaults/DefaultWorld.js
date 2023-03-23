// node_modules
import World from '@engine/worlds/GameWorld';

const getDefaultWorld = () => {
  return new World({ id: 'main' });
};
export default getDefaultWorld;
