import React from 'react';
import { useAtomValue } from 'jotai';

import { errorAtom } from '@/widgets/scanner-table/model';
import type { TableKey } from '@/widgets/scanner-table/model';

import { ErrorMessage } from '../ui';

type RequiresTable = { tableKey: TableKey };

export function withError<TProps extends RequiresTable>(
  Wrapped: React.ComponentType<TProps>
) {
  const WithError: React.FC<TProps> = (props) => {
    const error = useAtomValue(errorAtom)[props.tableKey];
    if (error) {
      return <ErrorMessage message={error} />;
    }

    return <Wrapped {...props} />;
  };

  WithError.displayName = `withError(${Wrapped.displayName || Wrapped.name || 'Component'})`;
  return WithError;
}
