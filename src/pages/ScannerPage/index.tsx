import React from 'react';

import { ScannerTable } from '@widgets/scanner-table/ui';

export const ScannerPage: React.FC = () => {
  return (
    <div
      className="
        grid size-full grid-cols-1 gap-0
        min-[1000px]:grid-cols-2
      "
    >
      <ScannerTable title="Trending Tokens" table="trending" rankBy="volume" />
      <ScannerTable title="New Tokens" table="new" rankBy="age" />
    </div>
  );
};
