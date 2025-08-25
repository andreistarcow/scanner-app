import React from 'react';

import { ScannerPage } from '../pages';

export const App: React.FC = () => {
  return (
    <div className="size-full min-h-screen">
      <main className="mx-auto size-full">
        <ScannerPage />
      </main>
    </div>
  );
};
