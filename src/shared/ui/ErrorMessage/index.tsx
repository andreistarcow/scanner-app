import React from 'react';

import { ErrorIcon } from '@/shared/ui';

interface ErrorMessageProps {
  message: string;
  buttonText?: string;
  loadingText?: string;
  loading?: boolean;
  onButtonClick?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  buttonText,
  loadingText = 'Loading...',
  loading = false,
  onButtonClick,
}) => {
  return (
    <div className="flex size-full min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
      <ErrorIcon className="size-10 text-red-400" />
      <div className="max-w-prose text-lg text-white/80">{message}</div>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          disabled={loading}
          className="rounded-md border border-white/80 bg-white/20 px-3 py-1 text-sm text-white/100 
                     opacity-90 transition-opacity hover:opacity-100 disabled:cursor-not-allowed"
        >
          {loading ? loadingText : buttonText}
        </button>
      )}
    </div>
  );
};
