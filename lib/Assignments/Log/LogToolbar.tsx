import showToast from '@/components/Alert/toast';
import Button from '@/components/Button';
import Spinner from '@/components/Loading/Spinner';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiRefreshCcw } from 'react-icons/fi';
dayjs.extend(duration);
interface LogToolbarProps {
  isMinimized: boolean;
  toggleMinimize: () => void;
  refetch: () => void;
}

const LogToolbar: React.FC<LogToolbarProps> = ({
  isMinimized,
  toggleMinimize,
  refetch,
}) => {
  const [lastRefetchTimestamp, setLastRefetchTimestamp] =
    useState<dayjs.Dayjs | null>(null);

  const [isRefetching, setIsRefetching] = useState(false);
  const handleRefresh = React.useCallback(async () => {
    const now = dayjs();
    const timeSinceLastRefetch = lastRefetchTimestamp
      ? now.diff(lastRefetchTimestamp, 'millisecond')
      : 10000;
    const timeUntilNextAllowedRefetch = 10000 - timeSinceLastRefetch;

    if (timeSinceLastRefetch >= 10000) {
      setLastRefetchTimestamp(now);
      setIsRefetching(true);
      await refetch();
      setIsRefetching(false);
    } else {
      showToast(
        `Please try again in ${dayjs
          .duration(timeUntilNextAllowedRefetch)
          .asSeconds()} seconds.`,
        'warning'
      );
    }
  }, [lastRefetchTimestamp, refetch]);
  return (
    <div className="h-full flex justify-between p-4">
      {isRefetching ? (
        <div className="pt-3 mx-auto">
          <Spinner />
        </div>
      ) : (
        <>
          <h2 className="flex text-xl font-semibold">Log</h2>
          <div className="flex">
            <Button size={'icon'} color="minimal" onClick={handleRefresh}>
              <FiRefreshCcw />
            </Button>
            <Button size={'icon'} color="minimal" onClick={toggleMinimize}>
              {isMinimized ? (
                <FiChevronUp size={26} />
              ) : (
                <FiChevronDown size={26} />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LogToolbar;
