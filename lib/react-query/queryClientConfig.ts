import {
  MutationCache,
  QueryCache,
  QueryClientConfig,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAxiosErrorMessage } from 'lib/react-query/axios';

const formatError = (handlerName: 'Query' | 'Mutation', error: unknown): void =>
  console.log(
    `Global ${handlerName} error handler. `,
    'Message:',
    getAxiosErrorMessage(error as AxiosError),
    'Error object:',
    error
  );

/**
 * important: this must be function and not object literal
 * so constructors (new QueryCache ...) are invoked for each test
 * to prevent shared cache between tests
 */
const getQueryClientConfig = (): QueryClientConfig => ({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,

      staleTime: 1000,
      retry: (failureCount, _error) => {
        const error = _error as AxiosError;
        if (error?.response?.status === 401) {
          // if input data is wrong or you're not authorized there's no point retrying a query
          return false;
        }
        const MAX_QUERY_RETRIES = 3;
        return failureCount < MAX_QUERY_RETRIES;
      },
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => formatError('Query', error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error(formatError('Mutation', error)),
  }),
});

export default getQueryClientConfig;
