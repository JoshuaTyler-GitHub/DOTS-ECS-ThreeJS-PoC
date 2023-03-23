// node_modules
import React, { Component } from 'react';

// components - atoms
import Button from '@components/atoms/Button';

class ButtonSmall extends Component {
  render() {
    const { props } = this;
    const { children, className, style } = props;
    return (
      <Button className={className} style={style}>
        {children}
      </Button>
    );
  }
}
export default ButtonSmall;

ButtonSmall.defaultProps = {
  className: String(`${Button.defaultProps.className} btn-sm`),
};
