// node_modules
import React, { Component } from 'react';

// components - atoms
import LoadingSpinner from '@app/components/atoms/LoadingSpinner';

class Main extends Component {
  render() {
    const { props } = this;
    const { children, className, isLoading, style } = props;

    return (
      <main
        aria-label={'main content'}
        className={className}
        role={'main'}
        style={style}
      >
        {/* Children */}
        {!isLoading && children}

        {/* Loading Spinner */}
        {isLoading && (
          <div className={'d-flex mt-5'}>
            <LoadingSpinner />
          </div>
        )}
      </main>
    );
  }
}
export default Main;

Main.defaultProps = {
  className: String('container-xxl'),
  isLoading: Boolean(false),
};
