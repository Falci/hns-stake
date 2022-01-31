import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

interface Props {
  title?: string;
}

const Error: React.FC<Props> = ({ children, title = '' }) => (
  <div
    className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
    role="alert"
  >
    <ExclamationCircleIcon className="inline w-6 h-6 mr-3" />
    <div>
      {title && <span className="block font-medium">{title}</span>}
      <span>{children}</span>
    </div>
  </div>
);

export default Error;
