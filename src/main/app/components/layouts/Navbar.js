// node_modules
import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    const { props } = this;
    const { children, className, style } = props;
    return (
      <nav
        aria-label={'navigation'}
        className={className}
        role={'navigation'}
        style={style}
      >
        {children}
      </nav>
    );
  }
}
export default Navbar;

Navbar.defaultProps = {
  className: String('container-xxl flex-wrap flex-lg-nowrap'),
};
