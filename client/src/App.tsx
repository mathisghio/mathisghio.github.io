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
  const [copied, setCopied] = useState(false)
  const isInstagram = /Instagram/.test(navigator.userAgent)

  if (!isInstagram || dismissed) return <>{children}</>

  const url = 'https://mathisghio.com'

  const handleCopy = () => {
    navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#08090E', overflow: 'hidden' }}>
      <style>{`
        @keyframes igDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%       { transform: scale(1.12); opacity: 1; }
        }
        @keyframes igArrowBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>

      {/* Pulsing dot — points to the ••• button in the top-right of the Instagram browser chrome */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.45) 0%, rgba(14,165,233,0.08) 70%)',
        animation: 'igDotPulse 1.6s ease-in-out infinite',
      }} />

      {/* Bouncing chevron arrows pointing up toward the ••• button */}
      <div style={{
        position: 'absolute', top: 90, right: 28,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        animation: 'igArrowBounce 1.2s ease-in-out infinite',
      }}>
        {[0.9, 0.6, 0.35].map((opacity, i) => (
          <svg key={i} width="34" height="20" viewBox="0 0 34 20" fill="none">
            <polyline points="2,18 17,2 32,18" stroke="rgba(148,163,184,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={opacity} />
          </svg>
        ))}
      </div>

      {/* Main content */}
      <div style={{
        position: 'absolute', top: '38%', left: 0, right: 0,
        padding: '0 2rem', maxWidth: 380, margin: '0 auto',
      }}>
        <p style={{
          color: '#f1f5f9', fontSize: 22, fontWeight: 700,
          fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.02em',
          marginBottom: '2rem', lineHeight: 1.3,
        }}>
          Open this page in your browser
        </p>

        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.25rem' }}>
          <div style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
            border: '1.5px solid rgba(148,163,184,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(241,245,249,0.75)', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
          }}>1</div>
          <p style={{ margin: 0, color: 'rgba(241,245,249,0.85)', fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>
            Tap <strong style={{ letterSpacing: '0.08em' }}>•••</strong> in the <strong>top right</strong>
          </p>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2.5rem' }}>
          <div style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
            border: '1.5px solid rgba(148,163,184,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(241,245,249,0.75)', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
          }}>2</div>
          <p style={{ margin: 0, fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>
            Then <span style={{ color: '#0EA5E9', fontWeight: 600 }}>Open in external browser</span>
          </p>
        </div>

        <button onClick={handleCopy} style={{
          background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)',
          color: '#0EA5E9', borderRadius: 8, padding: '10px 22px',
          fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer',
          display: 'block', marginBottom: '1rem',
        }}>
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>

        <button onClick={() => setDismissed(true)} style={{
          color: 'rgba(148,163,184,0.3)', background: 'none', border: 'none',
          fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}>
          Continue anyway
        </button>
      </div>
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
