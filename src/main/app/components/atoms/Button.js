// node_modules
import React, { Component } from 'react';

class Button extends Component {
  render() {
    const { props } = this;
    const { children, className, style } = props;
    return (
      <div
        aria-label={'button'}
        className={className}
        role={'button'}
        type={'button'}
        style={style}
      >
        {children || 'button'}
      </div>
    );
  }
}
export default Button;

Button.defaultProps = {
  className: String('btn btn-primary'),
};
