// node_modules
import React, { Component } from 'react';

// components - atoms
import LoadingSpinner from '@app/components/atoms/LoadingSpinner';

// engine - managers
import CanvasManager from '@engine/managers/CanvasManager';

class ManagedCanvas extends Component {
  constructor(props) {
    super(props);
    this.manager = new CanvasManager();
    this.ref = React.createRef();
    this.state = {
      isCanvasReady: Boolean(false),
    };
  }

  render() {
    const { manager, ref, state } = this;
    const { isCanvasReady } = state;
    const { state: managerState } = manager;
    const {
      canvasHeight,
      canvasWidth,
      elementHeight,
      elementOffsetX,
      elementOffsetY,
      elementWidth,
      elementZIndex,
    } = managerState;
    return (
      <React.Fragment>
        {!isCanvasReady && <LoadingSpinner />}
        <canvas
          height={canvasHeight}
          id={'world-canvas'}
          ref={ref}
          style={{
            backgroundColor: String('black'),
            display: String('block'),
            height: elementHeight,
            left: elementOffsetX,
            top: elementOffsetY,
            width: elementWidth,
            zIndex: elementZIndex,
          }}
          width={canvasWidth}
        />
      </React.Fragment>
    );
  }

  componentDidMount() {
    const { manager, props, ref } = this;
    const { onCanvasReady } = props;
    manager.initialize(ref.current, () => this.forceUpdate());
    this.setState({ isCanvasReady: Boolean(true) }, () =>
      onCanvasReady(manager),
    );
  }
}
export default ManagedCanvas;
