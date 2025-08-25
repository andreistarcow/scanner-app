import React from 'react';

interface NoDataMessageProps {
  message?: string;
  buttonText?: string;
  loadingText?: string;
  loading?: boolean;
  onButtonClick?: () => void;
}

export const NoDataMessage: React.FC<NoDataMessageProps> = ({
  message = "No data for these parameters",
  buttonText,
  loadingText = "Loading...",
  loading = false,
  onButtonClick,
}) => {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="max-w-prose text-base text-white/60">{message}</div>
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
