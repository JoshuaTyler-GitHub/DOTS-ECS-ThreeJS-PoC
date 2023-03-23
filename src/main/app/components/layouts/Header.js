// node_modules
import React, { Component } from 'react';

class Header extends Component {
  render() {
    const { props } = this;
    const { children, className, style } = props;
    return (
      <header className={className} style={style}>
        {children}
      </header>
    );
  }
}
export default Header;
