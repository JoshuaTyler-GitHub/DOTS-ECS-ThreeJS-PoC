// node_modules
import React, { Component } from 'react';

class ButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;
    const { addClassName, children, className, style } = props;
    return (
      <div
        aria-label={'button group'}
        className={`${className} ${addClassName}`}
        role={'group'}
        style={style}
      >
        {children}
      </div>
    );
  }
}
export default ButtonGroup;

ButtonGroup.defaultProps = {
  className: String('btn-group'),
};
