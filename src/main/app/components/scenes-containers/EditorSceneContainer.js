// node_modules
import React, { Component } from 'react';

// components - engine
import ManagedCanvas from '@components/engine/ManagedCanvas';

// components - layouts
import Main from '@components/layouts/Main';

// editor - managers
import EditorManager from '@editor/managers/EditorManager';

// engine - scenes
import EditorTestScene from '@editor/scenes/editor-test-scene/EditorTestScene';

class EditorSceneContainer extends Component {
  render() {
    const { props } = this;
    const { className, style } = props;
    return (
      <Main className={className} style={style}>
        <ManagedCanvas onCanvasReady={this.handleCanvasReady} />
      </Main>
    );
  }

  handleCanvasReady = (canvasManager) => {
    this.handleEditorStart(canvasManager);
  };

  handleEditorStart = (canvasManager) => {
    const scene = new EditorTestScene();
    EditorManager.newInstance(canvasManager, scene);
    EditorManager.start();
  };
}
export default EditorSceneContainer;
