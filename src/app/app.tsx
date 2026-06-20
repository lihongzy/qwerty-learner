import '@/App.css';
import { Analytics } from '@vercel/analytics/react';
import { AppProviders } from './providers';
import { AppRouter } from './router';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Analytics />
    </AppProviders>
  );
}

export default App;
