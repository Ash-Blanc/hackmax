import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { router } from './routes';
import { HackMaxStoreProvider } from './lib/store';
import './index.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HackMaxStoreProvider>
        <RouterProvider router={router} />
      </HackMaxStoreProvider>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}