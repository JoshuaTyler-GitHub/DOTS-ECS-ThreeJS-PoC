// node_modules
import React, { Component } from 'react';

// components - editor
import Editor from '@components/editor/Editor';

// components - layouts
import Page from '@components/layouts/Page';

class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Page
        className={'container-fluid p-0'}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Editor />
      </Page>
    );
  }
}
export default GamePage;
