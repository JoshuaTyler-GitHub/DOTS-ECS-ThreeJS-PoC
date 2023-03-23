// node_modules
import React, { Component } from 'react';

// components - layouts
import Header from '@components/layouts/Header';
import Main from '@components/layouts/Main';
import Sidebar from '@components/layouts/Sidebar';

class FTypeLayout extends Component {
  render() {
    const { props } = this;
    const { header, main, sidebar } = props;
    return (
      <React.Fragment>
        {header}
        {sidebar}
        {main}
      </React.Fragment>
    );
  }
}
export default FTypeLayout;

FTypeLayout.defaultProps = {
  header: <Header />,
  main: <Main />,
  sidebar: <Sidebar />,
};
