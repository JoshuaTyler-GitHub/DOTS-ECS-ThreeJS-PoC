const getInitialInstanceState = () => {
  return {
    activeSceneId: null,
    activeWorldId: String('main'),
    gameSnapshot: null,
    gameSnapshotHistory: [],
    isInitialized: Boolean(false),
    isRunning: Boolean(false),
  };
};
export default getInitialInstanceState;
