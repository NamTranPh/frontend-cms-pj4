import React, { useMemo } from 'react';
import { toast as reactToastify } from 'react-toastify';

export const useToast = () => {
  return useMemo(
    () => ({
      success: (message: string, title = 'Success:') =>
        reactToastify.success(
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-bold mr-1.5' }, title),
            React.createElement('span', null, message)
          )
        ),
      error: (message: string, title = 'Error:') =>
        reactToastify.error(
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-bold mr-1.5' }, title),
            React.createElement('span', null, message)
          )
        ),
      warning: (message: string, title = 'Warning:') =>
        reactToastify.warn(
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-bold mr-1.5' }, title),
            React.createElement('span', null, message)
          )
        ),
      info: (message: string, title = 'Info:') =>
        reactToastify.info(
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'font-bold mr-1.5' }, title),
            React.createElement('span', null, message)
          )
        ),
      toast: reactToastify,
    }),
    []
  );
};


export { reactToastify as toast };
