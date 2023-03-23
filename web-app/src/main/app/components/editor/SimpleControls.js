// node_modules
import React, { Component } from 'react';

// engine - managers
import EditorManager from '@editor/managers/EditorManager';

class SimpleControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
    };
  }

  render() {
    const world = EditorManager.worlds['main'];
    const { state: worldState } = world;
    const { isRunning, timeData } = worldState;
    const { cyclesPerSecond } = timeData;

    return (
      <div
        className={'bg-light d-flex flex-column p-1 rounded'}
        style={{
          height: String('175px'),
          right: Number('0'),
          position: String('absolute'),
          top: Number('0'),
          width: String('200px'),
        }}
      >
        {/* analytics */}
        <div className={'d-flex flex-column'}>
          <table className={'table table-bordered table-striped'}>
            <thead />
            <tbody>
              <tr>
                <th scope={'row'}>{'isRunning'}</th>
                <td>{String(isRunning)}</td>
              </tr>
              <tr>
                <th scope={'row'}>{'CPS'}</th>
                <td>{cyclesPerSecond}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* controls */}
        <div className={'d-flex justify-content-around'}>
          <button
            className={'btn btn-success'}
            onClick={() => EditorManager.start()}
          >
            {'start'}
          </button>
          <button
            className={'btn btn-danger'}
            onClick={() => EditorManager.stop()}
          >
            {'stop'}
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const intervalId = setInterval(() => this.forceUpdate(), 1000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    const { state } = this;
    const { intervalId } = state;
    clearInterval(intervalId);
  }
}
export default SimpleControls;
