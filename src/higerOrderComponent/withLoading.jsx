import React from 'react';
import Loader from '../components/Loader';

const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <Loader />
    }

    return <WrappedComponent {...props} />;
  }
}

export default withLoading;