import '@/App.css';
import { Analytics } from '@vercel/analytics/react';
import { AppProviders } from './providers';
import { AppRouter } from './router';

const enableVercelAnalytics = import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS === 'true';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
      {enableVercelAnalytics ? <Analytics /> : null}
    </AppProviders>
  );
}

export default App;
