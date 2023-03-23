// node_modules
import React, { Component } from 'react';

class LoadingSpinner extends Component {
  render() {
    const { props } = this;
    const { background, children, className, margin, size, style, text } =
      props;
    const classNameCombined = String(
      `${background} ${className} ${margin} ${text}`,
    );
    return (
      <div
        aria-busy={'true'}
        aria-label={'loading indicator'}
        className={classNameCombined}
        role={'progressbar'}
        style={{ height: size, width: size, ...style }}
      >
        {children}
      </div>
    );
  }
}
export default LoadingSpinner;

LoadingSpinner.defaultProps = {
  background: String('bg-white'),
  className: String('spinner-border'),
  margin: String('m-auto'),
  size: String('2rem'),
  text: String('text-primary'),
};
