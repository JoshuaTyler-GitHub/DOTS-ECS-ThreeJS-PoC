// node_modules
import React, { Component } from 'react';

// components - atoms
import ButtonSmall from '@components/atoms/ButtonSmall';

// components - layouts
import Sidebar from '@components/layouts/Sidebar';

// components - molecules
import ButtonGroup from '@components/molecules/ButtonGroup';

class EditorSidebar extends Component {
  render() {
    const { props } = this;
    const { className, initialWidth, style } = props;
    return (
      <Sidebar className={className} initialWidth={initialWidth} style={style}>
        <div className={'d-flex justify-content-center'}>
          <ButtonGroup>
            <ButtonSmall>{'Entities'}</ButtonSmall>
            <ButtonSmall>{'Systems'}</ButtonSmall>
            <ButtonSmall>{'Worlds'}</ButtonSmall>
          </ButtonGroup>
        </div>
      </Sidebar>
    );
  }
}
export default EditorSidebar;
