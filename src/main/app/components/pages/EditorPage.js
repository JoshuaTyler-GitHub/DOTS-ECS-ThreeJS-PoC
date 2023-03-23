// node_modules
import React, { Component } from 'react';

// components - editor
import EditorHeader from '@app/components/editor/EditorHeader';
import EditorSidebar from '@components/editor/EditorSidebar';

// components - scene-containers
import EditorSceneContainer from '@app/components/scenes-containers/EditorSceneContainer';

// components - layouts
import FTypeLayout from '@components/layouts/FTypeLayout';

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: String('72px'),
      sidebarWidth: String('200px'),
    };
  }

  render() {
    const { state } = this;
    const { headerHeight, sidebarWidth } = state;

    // Header
    const header = <EditorHeader style={{ height: headerHeight }} />;

    // Main
    const main = (
      <EditorSceneContainer
        style={{
          height: `calc(100vh - ${headerHeight})`,
          marginLeft: sidebarWidth,
        }}
      />
    );

    // Siderbar
    const sidebar = (
      <EditorSidebar
        initialWidth={sidebarWidth}
        onSidebarResize={this.onSidebarResize}
      />
    );

    return <FTypeLayout header={header} main={main} sidebar={sidebar} />;
  }

  onSidebarResize = (sidebarWidth) => {
    this.setState({ sidebarWidth });
  };
}
export default EditorPage;
