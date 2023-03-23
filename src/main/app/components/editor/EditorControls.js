// node_modules
import React, { Component } from 'react';

// components - editor
import EditorNavbar from '@app/components/editor/EditorHeader';
import SimpleControls from '@components/editor/SimpleControls';

// components - layouts
import FTypeLayout from '@components/layouts/FTypeLayout';

// editor - managers
import EditorManager from '@editor/managers/EditorManager';

class EditorControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
    };
  }

  render() {
    return (
      <React.Fragment>
        <SimpleControls />
      </React.Fragment>
    );
  }
}
export default EditorControls;
