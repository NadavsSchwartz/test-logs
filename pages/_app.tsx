import { MetaProvider } from '@/components/Meta';
import getQueryClientConfig from '@/lib/react-query/queryClientConfig';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Toaster } from 'react-hot-toast';
import 'styles/globals.css';
const ProgressBar = dynamic(() => import('@/components/Loading/ProgressBar'), {
  ssr: false,
});
const App = ({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
  dehydratedState: any;
}>) => {
  const [queryClient] = useState(() => new QueryClient(getQueryClientConfig()));

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Toaster />
          <ProgressBar />
          <TooltipProvider>
            <MetaProvider>
              <Component {...pageProps} />
            </MetaProvider>
          </TooltipProvider>
          <Analytics />
        </Hydrate>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;
