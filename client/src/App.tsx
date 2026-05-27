import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PartnersPage from "./pages/PartnersPage";

function InstagramBrowserGuard({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState(false)
  const isInstagram = /Instagram/.test(navigator.userAgent)

  if (!isInstagram || dismissed) return <>{children}</>

  const url = window.location.href
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, background: '#08090E',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center', gap: '1.5rem',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Barlow Condensed, sans-serif',
      }}>MG</div>

      <div style={{ maxWidth: 340 }}>
        <p style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 600, fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Ouvre ce lien dans ton navigateur
        </p>
        <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7 }}>
          {isIOS
            ? "Appuie sur ⋯ en bas à droite, puis sélectionne « Ouvrir dans Safari »."
            : "Appuie sur ⋮ en haut à droite, puis sélectionne « Ouvrir dans le navigateur »."}
        </p>
      </div>

      <button
        onClick={() => { navigator.clipboard?.writeText(url); }}
        style={{
          background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)',
          color: '#0EA5E9', borderRadius: 8, padding: '10px 20px',
          fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer',
        }}
      >
        Copier le lien
      </button>

      <button
        onClick={() => setDismissed(true)}
        style={{ color: 'rgba(148,163,184,0.35)', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
      >
        Continuer quand même
      </button>
    </div>
  )
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/partners"} component={PartnersPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <InstagramBrowserGuard>
            <Router />
          </InstagramBrowserGuard>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
