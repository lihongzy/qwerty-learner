import '@/App.css'
import '@/styles/ui-helpers.css'
import { AppProviders } from './providers'
import { AppRouter } from './router'

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
