// node_modules
import React, { Component } from 'react';

// components - layouts
import HeaderSticky from '@components/layouts/HeaderSticky';
import Navbar from '@components/layouts/Navbar';

class EditorHeader extends Component {
  render() {
    const { props } = this;
    const { className, style } = props;

    return (
      <HeaderSticky className={className} style={style}>
        <Navbar>
          <a
            aria-label={'RelytEngine.js'}
            className={'navbar-brand p-0'}
            href={'/'}
          >
            <h1>{'RelytEngine.js'}</h1>
          </a>
        </Navbar>
      </HeaderSticky>
    );
  }
}
export default EditorHeader;
