import { ApolloError } from '@apollo/client';
import React from 'react';

export type LoaderChild<T> = React.FC<{ data: T | undefined }>;

interface Props<T> {
  loading?: boolean;
  children: (data: T) => JSX.Element | JSX.Element;
  data: T;
  error?: ApolloError;
}

function Loader<T>({ loading, error, data, children }: Props<T>): JSX.Element {
  if (error) {
    return (
      <div>
        <span>{error.message}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!data) {
    return <></>;
  }

  return typeof children === 'function' ? children(data as T) : children;
}

export default Loader;
