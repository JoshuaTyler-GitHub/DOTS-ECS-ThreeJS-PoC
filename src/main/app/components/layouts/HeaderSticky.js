// node_modules
import React, { Component } from 'react';

// components - layouts
import Header from '@components/layouts/Header';

class HeaderSticky extends Component {
  render() {
    const { props } = this;
    const { children, className, style } = props;
    return (
      <Header className={className} style={style}>
        {children}
      </Header>
    );
  }
}
export default HeaderSticky;

HeaderSticky.defaultProps = {
  className: String('bg-dark navbar navbar-expand-lg navbar-dark sticky-top'),
};
