import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight">Starter</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <p className="text-muted-foreground text-center">
        Vite + React + TypeScript + Tailwind + Express. Edit{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
          client/App.tsx
        </code>{" "}
        to get started.
      </p>
      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}
