import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function App() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight">Starter</h1>

        <button
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
          className="rounded-md p-2 transition-colors hover:bg-accent"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <p className="text-muted-foreground text-center">
        Vite + TS + React + Tailwind + Node.js/Express + TanStack Query
      </p>

      <p className="text-muted-foreground text-center">
        Edit{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-bold">
          client/App.tsx
        </code>{' '}
        to get started.
      </p>
    </div>
  )
}
