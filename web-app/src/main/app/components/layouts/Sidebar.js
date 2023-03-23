// node_modules
import React, { Component } from 'react';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    const { initialWidth, style } = props;
    if (initialWidth) {
      style.width = initialWidth;
    }
    this.state = {};
  }

  render() {
    const { props } = this;
    const { children, className, style } = props;

    return (
      <aside
        aria-label={'sidebar'}
        className={className}
        role={'menu'}
        style={style}
      >
        {children}
      </aside>
    );
  }

  handleResize = (e) => {
    const { props } = this;
    // TODO: get the width of the sidebar
  };
}
export default Sidebar;

Sidebar.defaultProps = {
  className: String('bg-light border kit-sidebar py-2'),
  style: {}, // needed for initialWidth prop
};
