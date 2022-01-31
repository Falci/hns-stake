import { ApolloError } from '@apollo/client';
import React from 'react';
import AlertError from './alert/Error';
export type LoaderChild<T> = React.FC<{ data: T | undefined }>;

interface Props<T> {
  loading?: boolean;
  children: (data: T) => JSX.Element | JSX.Element;
  data: T;
  error?: ApolloError;
}

function Loader<T>({ loading, error, data, children }: Props<T>): JSX.Element {
  if (error) {
    return <AlertError>{error.message}</AlertError>;
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
