// game - resources
import CONFIG from '@game/resources/config.json';

const getInitialEnvironmentState = () => {
  return {
    environment: String(CONFIG.environment),
    version: String(CONFIG.version),
  };
};
export default getInitialEnvironmentState;
