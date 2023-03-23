// node_modules
import React, { Component } from 'react';

// components - pages
import EditorPage from '@components/pages/EditorPage';

// resources - styles
import '@styles/bootstrap.min.css';
import '@styles/kit.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <EditorPage />
      </React.Fragment>
    );
  }
}
export default App;
